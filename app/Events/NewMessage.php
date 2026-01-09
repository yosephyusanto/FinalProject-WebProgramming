<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Message $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        if (!$message->relationLoaded('sender')) {
            $message->load('sender');
        }
        
        $this->message = $message;
    }

    /**
     * The channel the event should broadcast on.
     */
    public function broadcastOn(): Channel
    {
        // Private chat per claim
        return new PrivateChannel('claims.' . $this->message->claim_id);
    }

    public function broadcastAs(){
        return 'newMessage';
    }

    /**
     * Data sent to frontend
     */
    public function broadcastWith(): array
    {
        $this->message->load('sender');
        return [
            'id' => $this->message->id,
            'claim_id' => $this->message->claim_id,
            'sender_id' => $this->message->sender_id,
            'message' => $this->message->message,
            'created_at' => $this->message->created_at->toISOString(),
            'is_system_message' => $this->message->is_system_message ?? false,
            'sender' => $this->message->sender ? [
                'id' => $this->message->sender->id,
                'name' => $this->message->sender->name,
            ] : null,
        ];
    }
}
