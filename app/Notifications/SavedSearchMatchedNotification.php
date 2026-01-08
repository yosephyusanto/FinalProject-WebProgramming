<?php

namespace App\Notifications;

use App\Models\MaterialListing;
use App\Models\SavedSearch;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Log;

class SavedSearchMatchedNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public function __construct(
        public MaterialListing $listing,
        public SavedSearch $search
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Data yang disimpan ke database DAN di-broadcast
     */
    public function toArray(object $notifiable): array
    {
        return [
            'listing_id' => $this->listing->id,
            'title' => 'New product matches your saved search',
            'message' => $this->listing->title,
            'url' => route('marketplace.show', $this->listing),
            'search_name' => $this->search->name,
        ];
    }

    /**
     * Channel untuk broadcast
     */
    public function broadcastOn(): array
    {
        $channel = 'users.' . $this->search->user_id;
        Log::info('🔴 broadcastOn() called', [
            'channel' => $channel,
            'search_user_id' => $this->search->user_id,
            'listing_user_id' => $this->listing->user_id,
        ]);
        return [
            new PrivateChannel($channel)
        ];
    }

    /**
     * Data untuk broadcast (real-time)
     */
    public function toBroadcast(object $notifiable): array
    {
        Log::info('🟡 toBroadcast() called', [
            'notifiable_id' => $notifiable->id,
            'listing_id' => $this->listing->id,
        ]);
        return [
            'listing_id' => $this->listing->id,
            'title' => 'New Product matches your saved search',
            'message' => $this->listing->title,
            'url' => route('marketplace.show', $this->listing),
            'search_name' => $this->search->name,
        ];
    }

    public function broadcastAs(): string
    {
        return 'SavedSearchMatched';
    }

 
}