<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GalleryProject extends Model
{
    use HasFactory;
    //
    protected $fillable = [
        'user_id',
        'material_listing_id',
        'title',
        'description'
    ];

    // relationships
    public function user():BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function materialListing():BelongsTo{
        return $this->belongsTo(MaterialListing::class);
    }

    public function photos():HasMany{
        return $this->hasMany(GalleryPhoto::class)->orderBy('order');
    }
}
