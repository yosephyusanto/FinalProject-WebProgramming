<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaterialListing;
use App\Models\SavedSearch;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MaterialListingController extends Controller
{
    //Display marketplace
    public function index(Request $request){
        $query = MaterialListing::query()
        ->where('status', 'available')
        ->with(['user', 'photos'])
        ->latest();
        
        // Apply filter from request
        if($request->hasAny(['material_type', 'color', 'location'])){
            $query->filter($request->only(['material_type', 'color', 'location']));
        }

        $listings = $query->paginate(12)->withQueryString();

        return Inertia::render('Marketplace/Index', 
        ['listings' => $listings, 
        'filters' => $request->only(['material_type', 'color', 'location'])]
        );
    }

    //Show specific listing
    public function show(MaterialListing $materialListing)
    {
        $materialListing->load(['user', 'photos', 'claim']); // eager load relationships
        // dd($materialListing);
        return Inertia::render('Marketplace/Show', [
            'listing' => $materialListing
        ]);
    }

    // creating from (for giver)
    public function create(){
        $user = Auth::user();
        /**@var App\Models\User $user */
        if(!$user->isGiver()){
            return redirect()->route('marketplace.index')->with('error', 'Only Givers can create listings.');
        }

        return Inertia::render('Marketplace/Create');
    }

    //Store new listings
    public function store(Request $request){
        // Only givers can create listings
        // $user = Auth::user();
        // /**@var App\Models\User $user */
        $user = $request->user();
        if(!$user->isGiver()){
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'material_type' => 'required|string',
            'color' => 'nullable|string',
            'estimated_weight' => 'nullable|numeric|min:0',
            'estimated_volume' => 'nullable|string|max:100',
            'condition' => 'required|string',
            'location' => 'required|string|max:500',
            'pickup_window_start' => 'nullable|date',
            'pickup_window_end' => 'nullable|date|after:pickup_window_start',
            'photos' => 'nullable|array',
            'photos.*' => 'image|max:2048'
        ]);

        // create listing
        $listing = $user->materialListings()->create($validated);

        // Handle the uploads
        if($request->hasFile('photos')){
            foreach($request->file('photos') as $index => $photo){
                $path = $photo->store('listing-photos', 'public');
                $listing->photos()->create([
                    'image_path' => $path,
                    'order' => $index,
                ]);
            }
        }

        // notification trigger
        $this->notifyMatchingSearches($listing);
        return redirect()->route('marketplace.show', $listing)->with('success', 'Listing created successfully!');
    }

    private function notifyMatchingSearches(MaterialListing $listing){
        $matchingSearches = SavedSearch::where('is_active', true)->get()
        ->filter(fn($search) => $search->matchesListing($listing));

        foreach($matchingSearches as $search){
            // this will trigger the websocket event
            event(new \App\Events\NewMatchingListing($search->user, $listing));
        }
    }
}
