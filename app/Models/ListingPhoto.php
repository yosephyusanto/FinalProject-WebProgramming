<?php

namespace App\Models;

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

    public $timestamps = false;
    protected $casts = ['created_at' => 'datetime'];

    // relationships
    public function materialListing():BelongsTo{
        return $this->belongsTo(MaterialListing::class);
    }
}
