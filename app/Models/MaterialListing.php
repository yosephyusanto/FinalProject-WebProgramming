<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MaterialListing extends Model
{
    use HasFactory;
    //
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_CLAIMED = 'claimed';
    public const STATUS_COMPLETED = 'completed';

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
        return $this->hasOne(Claim::class)->where('status', 'pending');
    }

    public function claims(){
        return $this->hasMany(Claim::class);
    }

    public function galleryProjects():HasMany{
        return $this->hasMany(GalleryProject::class);
    }

    // logic check
    public function scopeAvailable($query){
        return $query->where('status', self::STATUS_AVAILABLE);
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

    public function canBeClaimed(){
        return $this->status === self::STATUS_AVAILABLE;
    }

    public function hasActiveClaimFrom(User $user){
        return $this->claims()->where('claimed_by_user_id', $user->id)->where('status', 'pending')->exists();
    }
}
