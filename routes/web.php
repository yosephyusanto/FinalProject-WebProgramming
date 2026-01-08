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

use App\Http\Controllers\NotificationHistoryController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;


Broadcast::routes(['middleware' => ['auth']]);

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
    Route::post('/listings/{listing}/claim', [ClaimController::class, 'store'])
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
    Route::post('/saved-searches/{search}/toggle', [SavedSearchController::class, 'toggle'])
        ->name('saved-searches.toggle');
    Route::delete('/saved-searches/{search}', [SavedSearchController::class, 'destroy'])
        ->name('saved-searches.destroy');

    
    // My Gallery
    Route::get('/my-gallery', [MyGalleryController::class, 'index'])->name('my-gallery.index');
    Route::get('/my-gallery/create', [MyGalleryController::class, 'create'])->name('my-gallery.create');
    Route::post('/my-gallery', [MyGalleryController::class, 'store'])->name('my-gallery.store');
    Route::get('/my-gallery/{galleryProject}/edit', [MyGalleryController::class, 'edit'])->name('my-gallery.edit');
    Route::put('/my-gallery/{galleryProject}', [MyGalleryController::class, 'update'])->name('my-gallery.update');
    Route::delete('/my-gallery/{galleryProject}', [MyGalleryController::class, 'destroy'])->name('my-gallery.destroy');

    // Notifications
    Route::post('/notifications/{id}/read', function ($id) {
        \Illuminate\Support\Facades\Auth::user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail()
            ->markAsRead();

        return back();
    })->name('notifications.read');


    Route::post('/notifications/read-all', function () {
        \Illuminate\Support\Facades\Auth::user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.readAll');

    // MyProducts and MyClaims and Message
    Route::get('/my-products', [MaterialListingController::class, 'myProducts'])->name('my-products');
    Route::get('/my-claims', [ClaimController::class, 'myClaims'])->name('my-claims');
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    
    Route::post('/claims/{claim}/complete', [ClaimController::class, 'complete'])->name('claims.complete');

    // Notifications History
    Route::get('/notifications-history', [NotificationHistoryController::class, 'index'])
        ->name('notifications-history.index');

    Route::post('/notifications-history/{id}/read', [NotificationHistoryController::class, 'read'])
        ->name('notifications-history.read');

    Route::post('/notifications-history/read-all', [NotificationHistoryController::class, 'readAll'])
        ->name('notifications-history.readAll');
        
});

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

