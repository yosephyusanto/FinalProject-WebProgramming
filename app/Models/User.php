<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_url',
        'location',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function materialListings(){
        return $this->hasMany(MaterialListing::class);
    }

    public function claims(){
        return $this->hasMany(Claim::class, 'claimed_by_user_id');
    }

    public function sentMessages(){
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function savedSearches(){
        return $this->hasMany(SavedSearch::class);
    }

    public function galleryProjects(){
        return $this->hasMany(GalleryProject::class);
    }

    // Check for users role
    public function isGiver():bool{
        return $this->role === 'giver';
    }

    public function isTaker():bool{
        return $this->role === 'taker';
    }

}
