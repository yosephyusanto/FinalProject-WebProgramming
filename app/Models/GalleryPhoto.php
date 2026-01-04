<?php

namespace App\Models;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryPhoto extends Model
{
    //
    protected $fillable = [
        'gallery_project_id',
        'image_path',
        'order'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): string
    {
        return Storage::url($this->image_path);
    }

    public $timestamps = false;
    protected $casts = ['created_at' => 'datetime'];

    public function galleryProject():BelongsTo{
        return $this->belongsTo(GalleryProject::class);
    }
}
