<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SavedSearchController extends Controller
{
    //Show user's saved searches
    public function index(){
        // Auth : only takers can access
        $user = Auth::user();
        /**@var App\Models\User $user */

        if(!$user->isTaker()){
            return redirect()->route('marketplace.index')->with('info', 'Saved searches are only available for takers.');
        }
        
        $searches = $user->savedSearches()->latest()->get();

        return Inertia::render('Searches/Index',[
            'searches' => $searches,
        ]);
    }

    // stored new saved search
    public function store(Request $request){
        $user = Auth::user();
        /**@var App\Models\User $user */
        if(!$user->isTaker()){
            abort(403, 'Only takers can save searches.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'material_type' => 'nullable|string',
            'color' => 'nullable|string',
            'location' => 'nullable|string'
        ]);

        $user->savedSearches()->create([
            'name' => $validated['name'],
            'search_parameters' => array_filter([
                'material_type' => $validated['material_type'] ?? null,
                'color' => $validated['color'] ?? null,
                'location' => $validated['location'] ?? null,
            ]),
            'is_active' => true,
        ]);

        return back()->with('succes', 'Search saved! You will get notifications for matching listings.');
    }
}
