<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    MaterialListingController,
    ClaimController,
    MessageController,
    SavedSearchController,
    GalleryProjectController,
    MyGalleryController,
    HomeController
};
use Inertia\Inertia;

Route::get('/login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::post('/logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');

Route::get('/register', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);

Route::get('/marketplace', [MaterialListingController::class, 'index'])
    ->name('marketplace.index');

// Community Gallery
Route::get('/gallery', [GalleryProjectController::class, 'index'])
    ->name('gallery.index');
Route::get('/gallery/{galleryProject}', [GalleryProjectController::class, 'show'])
    ->name('gallery.show');

// Protected routes
Route::middleware(['auth'])->group(function () {
    // Marketplace
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
    
    // My Gallery
    Route::get('/my-gallery', [MyGalleryController::class, 'index'])->name('my-gallery.index');
    Route::get('/my-gallery/create', [MyGalleryController::class, 'create'])->name('my-gallery.create');
    Route::post('/my-gallery', [MyGalleryController::class, 'store'])->name('my-gallery.store');
    Route::get('/my-gallery/{galleryProject}/edit', [MyGalleryController::class, 'edit'])->name('my-gallery.edit');
    Route::put('/my-gallery/{galleryProject}', [MyGalleryController::class, 'update'])->name('my-gallery.update');
    Route::delete('/my-gallery/{galleryProject}', [MyGalleryController::class, 'destroy'])->name('my-gallery.destroy');

});

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Route::get('/', function () {
//     return Inertia::render('Home', [
//         'stats' => [
//             'listings' => \App\Models\MaterialListing::available()->count(),
//             'projects' => \App\Models\GalleryProject::count(),
//             'impact' => \App\Models\MaterialListing::where('status', 'completed')
//                 ->sum('estimated_weight'),
//         ]
//     ]);
// })->name('home');
