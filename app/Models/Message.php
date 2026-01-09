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
        'is_system_message',
        'read_at'
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'is_system_message' => 'boolean'
    ];

    // Relationships
    public function claim():BelongsTo{
        return $this->belongsTo(Claim::class);
    }

    public function sender():BelongsTo{
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function isSystemMessage(){
        return $this->is_system_message || is_null($this->sender_id);
    }

    public function scopeSystemMessages($query){
        return $query->where('is_system_message', true)->orWhereNull('sender_id');
    }

   public function scopeUserMessages($query){
        return $query->where('is_system_message', false)->whereNotNull('sender_id');
    }

    // check for mark as read
    public function markAsRead(){
        if(!$this->read_at){
            $this->update(['read_at'=>now()]);
        }
    }

}
