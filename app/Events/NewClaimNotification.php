<?php

namespace App\Events;

use App\Models\Claim;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewClaimNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Claim $claim;
    /**
     * Create a new event instance.
     */
    public function __construct(Claim $claim)
    {
        //
        $this->claim = $claim;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): Channel
    {
        return new PrivateChannel('user.' . $this->claim->materialListing->user_id);
    }

    // Data sent to frontend
    public function broadcastWith(): array{
        return [
            'type' => 'new_claim',
            'claim_id' => $this->claim->id,
            'listing_id' => $this->claim->material_listing_id,
            'listing_title' => $this->claim->materialListing->title,
            'claimer_name' => $this->claim->claimedBy->name,
            'message' => $this->claim->claimedBy->name . ' has claimed your listing: "' . $this->claim->materialListing->title . '"',
            'created_at' => now()->toISOString(),
            'link' => '/claims/' . $this->claim->id
        ];
    }


    public function broadcastAs(){
        return 'NewClaimNotification';
    }
}
