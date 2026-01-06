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

    public function broadcastWith()
    {
        return [
            'listing_id' => $this->listing->id,
            'title' => $this->listing->title,
            'material_type' => $this->listing->material_type,
            'user_name' => $this->listing->user->name,
        ];
    }
}
