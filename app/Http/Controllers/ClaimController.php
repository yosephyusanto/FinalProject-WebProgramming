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
        // $user = Auth::user();
        // /**@var App\Models\User $user */
        $user = $request->user();

        if(!$user->isTaker()){
            return back()->with('error', 'Only takers can claim listings.');
        }
        
        // logic : user cannot claim their own listing
        if($listing->user_id === Auth::id()){
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

                $claim = Claim::createClaim($listing, $user);
                            
                // Update listing status
                $listing->update(['status' => 'claimed']);

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
            'otherUser' => $claim->claimed_by_user_id === Auth::id() ? $claim->materialListing->user : $claim->claimedBy
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
            abort(403, 'Unathorized. Only the listing owner can complete claims.');
        }

        // Can only complete a pending or confirmed claims
        if(!in_array($claim->status, ['pending', 'confirmed'])){
            return back()->with('error', 'This claim cannot be marked as complete.');
        }

        DB::transaction(function () use ($claim){
            $claim->update(['status' => 'completed']);
            $claim->materialListing->update(['status' => MaterialListing::STATUS_COMPLETED]);
        });

        return back()->with('success', 'Claim marked as completed successfully!');
    }
}

