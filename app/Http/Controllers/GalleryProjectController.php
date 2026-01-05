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

    public function show(GalleryProject $galleryProject)
    {
        $galleryProject->load(['user', 'photos', 'materialListing']);

        return Inertia::render('Gallery/Show', [
            'project' => $galleryProject,
        ]);
    }
}
