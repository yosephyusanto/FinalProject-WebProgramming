<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaterialListing;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Claim;
use Inertia\Inertia;
use App\Events\NewClaimNotification;

class ClaimController extends Controller
{
    //Create claim (only for takers)
    public function store(Request $request, MaterialListing $listing){
        $user = $request->user();

        if(!$user->isTaker()){
            return back()->with('error', 'Only Takers can claim listings.');
        }
        
        if($listing->user_id === $user->id){
            return back()->with('error', 'You cannot claim your own listings.');
        }

        try{    
            $claim = DB::transaction(function () use ($listing, $user) {
                // refresh listing inside transaction
                $listing->refresh();

                // logic : listing must be able to be claimed
                if(!$listing->canBeClaimed()){
                    throw new \Exception('This listing is no longer available.');
                }

                // Check if user already has an active claim on the material
                if($listing->hasActiveClaimFrom($user)){
                    throw new \Exception('You already have an active claim on this listing.');
                }

                $claim = Claim::createClaim($listing, $user);
                            
                // Update listing status
                $listing->update(['status' => MaterialListing::STATUS_CLAIMED]);

                return $claim;
            });

            // Send notification to giver
            event(new NewClaimNotification($claim));
                
            return redirect()->route('messages.index')
            ->with('success', 'Listing claimed succesfully! You can now coordinate pickup.');
        }catch(\Exception $e){
            return back()->with('error', $e->getMessage());
        }
    }

    // show claim details with chat
    public function show(Claim $claim){
        // Authorization: user must be a part of this claim
        if($claim->claimed_by_user_id !== Auth::id() && $claim->materialListing->user_id !== Auth::id()){
            abort(403, 'Unauthorized.');
        }

        $claim->load(['materialListing.photos', 'claimedBy', 'messages.sender']);

        return Inertia::render('Claims/Show', [
            'claim' => $claim,
            'listing' => $claim->materialListing,
            'messages' => $claim->messages,
            'authUserId' => Auth::id(),
            'otherUser' => $claim->claimed_by_user_id === Auth::id() ? $claim->materialListing->user : $claim->claimedBy,
        ]);
    }

    public function myClaims(Request $request){
        $user = $request->user();

        $claims = Claim::where('claimed_by_user_id', $user->id)
        ->with(['materialListing.photos', 'materialListing.user'])
        ->latest()
        ->paginate(12);

        return Inertia::render('Claims/MyClaims', [
            'claims' => $claims
        ]);
    }

    public function complete(Request $request, Claim $claim){
        // Auth: Only giver can complete a claim
        if($claim->materialListing->user_id !== Auth::id()){
            abort(403, 'Unauthorized. Only the listing owner can complete claims.');
        }

        // Can only complete a pending claims
        if($claim->status !== 'pending'){
            return back()->with('error', 'This claim cannot be marked as complete.');
        }

        DB::transaction(function () use ($claim){
            $claim->update(['status' => 'completed']);
            $claim->materialListing->update(['status' => MaterialListing::STATUS_COMPLETED]);
        });

        return back()->with('success', 'Claim marked as completed successfully!');
    }

    public function cancel(Request $request, Claim $claim){
        // Only giver can cancel
        if($claim->materialListing->user_id !== Auth::id()){
            abort(403, 'Unauthorized. Only the listing owner can cancel claims.');
        }

        // Can only cancel if the status is still pending
        if($claim->status !== 'pending'){
            return back()->with('error', 'Only pending claims can be cancelled.');
        }

        DB::transaction(function () use ($claim){
            // Update claim status
            $claim->update(['status' => 'cancelled']);

            // Update listing status back to available
            $claim->materialListing->update(['status' => MaterialListing::STATUS_AVAILABLE]);

            // Create the system chat for the message
            $claim->messages()->create([
                'sender_id' => null, 
                'message' => 'Claim has been cancelled by the giver. This chat is now closed.',
                'is_system_message' => true
            ]);
        });

        return back()->with('success', 'Claim cancelled successfully,');
    }
}


