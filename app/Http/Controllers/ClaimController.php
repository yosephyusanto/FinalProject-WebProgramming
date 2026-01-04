<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaterialListing;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Claim;
use Inertia\Inertia;

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
                    return back()->with('error', 'This listing is no longer available.');
                }

                $claim = Claim::createClaim($listing, $user);
                            
                // Update listing status
                $listing->update(['status' => 'claimed']);

                return $claim;
            });
                
            return redirect()->route('claim.show', $claim)
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
            'message' => $claim->messages,
            'otherUser' => $claim->claimed_by_user_id === Auth::id() ? $claim->materialListing->user : $claim->claimedBy
        ]);
    }
}

