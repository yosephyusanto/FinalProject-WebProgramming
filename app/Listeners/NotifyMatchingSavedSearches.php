<?php

namespace App\Listeners;

use App\Events\MaterialListingCreated;
use App\Models\MaterialListing;
use App\Models\SavedSearch;
use App\Notifications\SavedSearchMatchedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
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
    public function handle(MaterialListingCreated $event): void
    {
        $listing = $event->listing;

        $savedSearches = SavedSearch::where('is_active', true)
            ->with('user')
            ->get();

        foreach ($savedSearches as $search) {
            if ($search->matchesListing($listing)) {
                $search->user->notify(
                    new SavedSearchMatchedNotification($listing, $search)
                );
            }
        }
    }
}
