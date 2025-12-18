<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    //
    protected $fillable = [
        'claim_id',
        'sender_id',
        'message',
        'read_at'
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'created_at' => 'datetime'
    ];

    // Relationships
    public function claim():BelongsTo{
        return $this->belongsTo(Claim::class);
    }

    public function sender():BelongsTo{
        return $this->belongsTo(User::class, 'sender_id');
    }

    // check for mark as read
    public function markAsRead(){
        if(!$this->read_at){
            $this->update(['read_at'=>now()]);
        }
    }

}
