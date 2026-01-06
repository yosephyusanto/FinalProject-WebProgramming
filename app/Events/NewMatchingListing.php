<?php

namespace App\Events;

use App\Models\MaterialListing;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMatchingListing 
{
    use Dispatchable, SerializesModels;

    public MaterialListing $listing;
    public int $userId;

    public function __construct(MaterialListing $listing, int $userId)
    {
        $this->listing = $listing;
        $this->userId = $userId;
    }
}
