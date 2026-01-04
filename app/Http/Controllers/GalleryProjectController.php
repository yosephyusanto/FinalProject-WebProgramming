<?php

namespace App\Http\Controllers;

use App\Models\GalleryProject;
use App\Models\MaterialListing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class GalleryProjectController extends Controller
{
    // Show gallery index
    public function index()
    {
        $projects = GalleryProject::with(['user', 'materialListing', 'photos'])
            ->latest()
            ->paginate(12);
            
        // Calculate total impact
        $totalImpact = MaterialListing::where('status', 'completed')
            ->sum('estimated_weight');
            
        return Inertia::render('Gallery/Index', [
            'projects' => $projects,
            'totalImpact' => $totalImpact,
        ]);
    }
    
    // Create gallery project form
    public function create()
    {
        $user = Auth::user();
        /**@var App\Models\User $user */
        $userListings = $user->claims()
            ->with('materialListing')
            ->where('status', 'confirmed')
            ->get()
            ->pluck('materialListing');
            
        return Inertia::render('Gallery/Create', [
            'userListings' => $userListings,
        ]);
    }
    
    // Store gallery project
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'material_listing_id' => 'nullable|exists:material_listings,id',
            'photos' => 'required|array|min:1',
            'photos.*' => 'image|max:5120',
        ]);
        
        // Verify user has access to the referenced listing (if provided)
        $user = Auth::user();
        /**@var App\Models\User $user */
        if ($validated['material_listing_id']) {
            $hasAccess = $user->claims()
                ->where('material_listing_id', $validated['material_listing_id'])
                ->where('status', 'confirmed')
                ->exists();
                
            if (!$hasAccess) {
                abort(403, 'You cannot reference this listing.');
            }
        }
        
        $project = $user->galleryProjects()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'material_listing_id' => $validated['material_listing_id'] ?? null,
        ]);
        
        // Store project photos
        foreach ($request->file('photos') as $index => $photo) {
            $path = $photo->store('gallery-projects', 'public');
            $project->photos()->create([
                'image_path' => $path,
                'order' => $index,
            ]);
        }
        
        return redirect()->route('gallery.show', $project)
            ->with('success', 'Project shared to the gallery!');
    }

    public function show(GalleryProject $galleryProject)
    {
        $galleryProject->load(['user', 'photos', 'materialListing']);

        return Inertia::render('Gallery/Show', [
            'project' => $galleryProject,
        ]);
    }
}
