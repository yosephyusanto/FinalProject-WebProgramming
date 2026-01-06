<?php

namespace App\Listeners;

use App\Events\NewMatchingListing;
use App\Models\MaterialListing;
use App\Models\SavedSearch;
use App\Notifications\SavedSearchMatchedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\InteractsWithQueue;

class NotifyMatchingSavedSearches
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewMatchingListing $event): void
    {
        $listing = $event->listing;
        
        Log::info('NewMatchingListing event triggered', [
            'listing_id' => $listing->id,
            'listing_user_id' => $listing->user_id
        ]);

        $savedSearches = SavedSearch::where('is_active', true)
            ->with('user')
            ->get();

        Log::info('Found active saved searches', [
            'count' => $savedSearches->count()
        ]);

        foreach ($savedSearches as $search) {
            Log::info('Checking saved search', [
                'search_id' => $search->id,
                'search_user_id' => $search->user_id,
                'search_name' => $search->name
            ]);
            
            if ($search->matchesListing($listing)) {
                Log::info('Match found! Sending notification', [
                    'search_id' => $search->id,
                    'to_user_id' => $search->user_id,
                    'listing_id' => $listing->id
                ]);
                
                $search->user->notify(
                    new SavedSearchMatchedNotification($listing, $search)
                );
            } else {
                Log::info('No match for this search', [
                    'search_id' => $search->id
                ]);
            }
        }
    }
}
