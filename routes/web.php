<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    MaterialListingController,
    ClaimController,
    MessageController,
    SavedSearchController,
    GalleryProjectController
};
use Inertia\Inertia;

Route::get('/login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::post('/logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');

Route::get('/register', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);

// Protected routes
Route::middleware(['auth'])->group(function () {
    // Marketplace
    Route::get('/marketplace', [MaterialListingController::class, 'index'])
        ->name('marketplace');
    Route::get('/listings/create', [MaterialListingController::class, 'create'])
        ->name('listings.create');
    Route::post('/listings', [MaterialListingController::class, 'store'])
        ->name('listings.store');
    Route::get('/listings/{materialListing}', [MaterialListingController::class, 'show'])
        ->name('marketplace.show');
    
    // Claims
    Route::post('/listings/{materialListing}/claim', [ClaimController::class, 'store'])
        ->name('claims.store');
    Route::get('/claims/{claim}', [ClaimController::class, 'show'])
        ->name('claims.show');
    
    // Messages
    Route::post('/claims/{claim}/messages', [MessageController::class, 'store'])
        ->name('messages.store');
    
    // Saved Searches
    Route::get('/searches', [SavedSearchController::class, 'index'])
        ->name('searches.index');
    Route::post('/searches', [SavedSearchController::class, 'store'])
        ->name('searches.store');
    
    // Gallery
    Route::get('/gallery', [GalleryProjectController::class, 'index'])
        ->name('gallery.index');
    Route::get('/gallery/create', [GalleryProjectController::class, 'create'])
        ->name('gallery.create');
    Route::post('/gallery', [GalleryProjectController::class, 'store'])
        ->name('gallery.store');
    Route::get('/gallery/{galleryProject}', [GalleryProjectController::class, 'show'])
        ->name('gallery.show');
});

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'stats' => [
            'listings' => \App\Models\MaterialListing::available()->count(),
            'projects' => \App\Models\GalleryProject::count(),
            'impact' => \App\Models\MaterialListing::where('status', 'completed')
                ->sum('estimated_weight'),
        ]
    ]);
})->name('home');
