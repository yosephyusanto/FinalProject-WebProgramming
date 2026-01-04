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

    protected $appends = ['url'];
    public $timestamps = false;

    // relationships
    public function materialListing():BelongsTo{
        return $this->belongsTo(MaterialListing::class);
    }

    public function getUrlAttribute(){
        return asset('storage/' . $this->image_path);
    }
}
