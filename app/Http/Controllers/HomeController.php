<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\MaterialListing;
use App\Models\GalleryProject;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'stats' => [
                'listings' => MaterialListing::available()->count(),
                'projects' => GalleryProject::count(),
                'impact' => MaterialListing::where('status', MaterialListing::STATUS_COMPLETED)
                    ->sum('estimated_weight'),
            ],
            'featuredProjects' => GalleryProject::with(['photos'])
                ->latest()
                ->take(3)
                ->get()
                ->map(function ($project) {
                    return [
                        'id' => $project->id,
                        'title' => $project->title,
                        'description' => $project->description,
                        'image' => optional($project->photos->first())->image_url,
                    ];
                }),
        ]);
    }
}
