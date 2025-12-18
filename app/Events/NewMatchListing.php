<?php

namespace App\Events;

use App\Models\User;
use App\Models\MaterialListing;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMatchingListing
{
    use Dispatchable, SerializesModels;

    public User $user;
    public MaterialListing $listing;

    public function __construct(User $user, MaterialListing $listing)
    {
        $this->user = $user;
        $this->listing = $listing;
    }
}
