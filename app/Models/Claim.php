<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Claim extends Model
{
    //
    protected $fillable = [
        'material_listing_id',
        'claimed_by_user_id',
        'status'
    ];

    protected $casts = ['status' => 'string'];

    // Relationships
    public function materialListing():BelongsTo{
        return $this->belongsTo(MaterialListing::class);
    }

    public function claimedBy():BelongsTo{
        return $this->belongsTo(User::class, 'claimed_by_user_id');
    }

    public function messages():HasMany{
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    // Logic Check
    public static function createClaim(MaterialListing $listing, User $taker){
        if(!$taker->isTaker()){
            throw new \Exception('Only takers can claim listings.');
        }

        if(!$listing->canBeClaimed()){
            throw new \Exception('This listing is not available for claim.');
        }

        return self::create([
            'material_listing_id' => $listing->id,
            'claimed_by_user_id' => $taker->id,
            'status' => 'pending',
        ]);
    }
}
