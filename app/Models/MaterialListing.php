<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MaterialListing extends Model
{
    //
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'material_type',
        'color',
        'estimated_weight',
        'estimated_volume',
        'condition',
        'location',
        'status',
        'price',
        'pricing_type',
        'currency',
        'stock',
        'pickup_window_start',
        'pickup_window_end'
    ];

    protected $casts = [
        'pickup_window_start' => 'datetime',
        'pickup_window_end' => 'datetime',
        'estimated_weight' => 'decimal:2'
    ];

    // relationships
    public function user():BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function photos():HasMany{
        return $this->hasMany(ListingPhoto::class)->orderBy('order');
    }

    public function claim():HasOne{
        return $this->hasOne(Claim::class)->whereIn('status', ['pending', 'confirmed']);
    }

    public function galleryProjects():HasMany{
        return $this->hasMany(GalleryProject::class);
    }

    // logic check
    public function scopeAvailable($query){
        return $query->where('status', 'available');
    }

    public function scopeFilter($query, array $filters){
        $query->when($filters['material_type'] ?? null, function($query, $materialType){
            $query->where('material_type', $materialType);
        })->when($filters['color'] ?? null, function($query, $color){
            $query->where('color', 'like', "%{$color}%");
        })->when($filters['location'] ?? null, function($query, $location){
            $query->where('location', 'like', "%{$location}%");
        });
    }

    public function isFree(){
        return $this->pricing_type === 'free';
    }

    public function isPurchasable(){
        return $this->is_active && $this->stock > 0;
    }

    public function canBeClaimed(){
        return $this->status === 'available' && $this->isPurchasable();
    }
}
