<?php

namespace App\Models;

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

    public $timestamps = false;
    protected $casts = ['created_at' => 'datetime'];

    public function galleryProject():BelongsTo{
        return $this->belongsTo(GalleryProject::class);
    }
}
