<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedSearch extends Model
{
    //
    protected $fillable = [
        'user_id',
        'name',
        'search_parameters',
        'is_active'
    ];

    protected $casts = [
        'search_parameters' => 'array',
        'is_active' => 'boolean'
    ];

    // relationships
    public function user():BelongsTo{
        return $this->belongsTo(User::class);
    }

    // Logic
    // Check if listing match with searches
    public function matchesListing(MaterialListing $listing):bool{
        $params = $this->search_parameters;
        if(isset($params['material_type']) && $params['material_type'] !== $listing->material_type){
            return false;
        }

        if(isset($params['color']) && stripos($listing->color ?? '', $params['color']) === false){
            return false;
        }

        if(isset($params['location']) && stripos($listing->location, $params['location']) === false){
            return false;
        }

        return true;
    }
}
