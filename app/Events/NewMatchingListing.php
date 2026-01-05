<?php

namespace App\Events;

use App\Models\MaterialListing;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NewMatchingListing implements ShouldBroadcast
{
    use SerializesModels;

    public MaterialListing $listing;
    public int $userId;

    public function __construct(MaterialListing $listing, int $userId)
    {
        $this->listing = $listing;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('users.' . $this->userId);
    }
}
