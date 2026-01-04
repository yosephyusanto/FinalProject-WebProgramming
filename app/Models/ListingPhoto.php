<?php

namespace App\Models;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingPhoto extends Model
{
    //
    protected $fillable = [
        'material_listing_id',
        'image_path',
        'order'
    ];

    // otomatis dipanggil saat model diserialize ke JSON
    protected $appends = ['image_url'];
    public function getImageUrlAttribute(): string
    {
        return Storage::url($this->image_path);
    }

    public $timestamps = false;
    protected $casts = ['created_at' => 'datetime'];

    // relationships
    public function materialListing():BelongsTo{
        return $this->belongsTo(MaterialListing::class);
    }
}
