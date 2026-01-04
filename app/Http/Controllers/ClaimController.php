<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaterialListing;
use Illuminate\Support\Facades\Auth;
use App\Models\Claim;
use Inertia\Inertia;

class ClaimController extends Controller
{
    //Create claim (only for takers)
    public function store(Request $request, MaterialListing $listing){
        $user = Auth::user();
        /**@var App\Models\User $user */

        if(!$user->isTaker()){
            return back()->with('error', 'Only takers can claim listings.');
        }
        
        // logic : listing must be able to be claimed
        if(!$listing->canBeClaimed()){
            return back()->with('error', 'This listing is no longer available.');
        }

        // logic : user cannot claim their own listing
        if($listing->user_id === Auth::id()){
            return back()->with('error', 'You cannot claim your own listings.');
        }

        $quantity = $request->input('quantity', 1);

        if($quantity > $listing->stock){
            return back()->with('error', 'Not enough stock available.');
        }

        try{
            $claim = Claim::create([
                'material_listing_id' => $listing->id,
                'claimed_by_user_id' => $user->id,
                'quantity' => $quantity,
                'price_at_purchase' => $listing->price,
                'status' => 'pending'
            ]);

            // Update listing status
            $listing->decrement('stock', $quantity);

            if($listing->stock <= 0){
                return redirect()->route('claims.show', $claim)
                ->with('succes', 'Listing claimed succesfully! You can now coordinate pickup.');
            }
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
}

