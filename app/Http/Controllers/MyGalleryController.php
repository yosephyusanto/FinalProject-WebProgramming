<?php

namespace App\Http\Controllers;

use App\Models\GalleryProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;

class MyGalleryController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {   
        $user = Auth::user();
        /**@var App\Models\User $user */;
        $projects = $user->galleryProjects()
            ->with('photos')
            ->latest()
            ->paginate(12);
        
        return Inertia::render('Gallery/My/Index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        /**@var App\Models\User $user */
        $userListings = $user->claims()
            ->with('materialListing')
            ->where('status', 'completed')
            ->get()
            ->pluck('materialListing');

        return Inertia::render('Gallery/My/Create', [
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
                ->where('status', 'completed')
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

    public function edit(GalleryProject $galleryProject)
    {
        $this->authorize('update', $galleryProject);

        return Inertia::render('Gallery/My/Edit', [
            'project' => $galleryProject->load(['photos', 'materialListing']),
        ]);
    }

    public function update(Request $request, GalleryProject $galleryProject)
    {
        $this->authorize('update', $galleryProject);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'material_listing_id' => 'nullable|exists:material_listings,id',

            'existing_photos' => 'array',
            'existing_photos.*.id' => 'exists:gallery_photos,id',
            'existing_photos.*.order' => 'integer',

            'deleted_photo_ids' => 'sometimes|array',
            'deleted_photo_ids.*' => 'integer|exists:gallery_photos,id',

            'new_photos' => 'array',
            'new_photos.*' => 'image|max:5120',
        ]);

        // Update project info
        $galleryProject->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'material_listing_id' => $validated['material_listing_id'] ?? null,
        ]);

        // cast to collection and filter valid ids
        $deletedIds = collect($validated['deleted_photo_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->values();


        if ($deletedIds->isNotEmpty()) {
            $photos = $galleryProject->photos()
                ->whereIn('id', $deletedIds)
                ->get();

            foreach ($photos as $photo) {
                if (Storage::disk('public')->exists($photo->image_path)) {
                    Storage::disk('public')->delete($photo->image_path);
                }

                $photo->delete();
            }
        }


        /** UPDATE ORDER EXISTING PHOTOS */
        if (!empty($validated['existing_photos'])) {
            foreach ($validated['existing_photos'] as $photo) {
                $galleryProject->photos()
                    ->where('id', $photo['id'])
                    ->update(['order' => $photo['order']]);
            }
        }

        /** STORE NEW PHOTOS */
        if ($request->hasFile('new_photos')) {
            $maxOrder = $galleryProject->photos()->max('order') ?? 0;

            foreach ($request->file('new_photos') as $index => $photo) {
                $path = $photo->store('gallery-projects', 'public');

                $galleryProject->photos()->create([
                    'image_path' => $path,
                    'order' => $maxOrder + $index + 1,
                ]);
            }
        }

        return redirect()
            ->route('my-gallery.index')
            ->with('success', 'Project updated successfully');
    }

    public function destroy(GalleryProject $galleryProject)
    {
        $this->authorize('delete', $galleryProject);

        // hapus file di public/storage/gallery-projects/
        foreach ($galleryProject->photos as $photo) {
            if (Storage::disk('public')->exists($photo->image_path)) {
                Storage::disk('public')->delete($photo->image_path);
            }
        }
        
        $galleryProject->delete();

        return redirect()
            ->route('my-gallery.index')
            ->with('success', 'Project deleted successfully');
    }    
}
