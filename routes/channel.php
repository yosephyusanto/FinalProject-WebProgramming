<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Claim;

Broadcast::channel('claims.{claimId}', function ($user, $claimId) {
    $claim = Claim::find($claimId);

    if (! $claim) {
        return false;
    }

    // Only users involved in the claim can listen
    return $claim->claimed_by_user_id === $user->id
        || $claim->materialListing->user_id === $user->id;
});

// Notifications
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});