<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\NewMessage;

class MessageController extends Controller
{
    //store new message in claim chat
    public function store(Request $request, Claim $claim){
        // Authorization: all user must be a part of the claimed
        if($claim->claimed_by_user_id !== Auth::id() && $claim->materialListing->user_id !== Auth::id()){
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $message = $claim->messages()->create([
            'sender_id' => Auth::id(),
            'message' => $validated['message']
        ]);

        // ensure sender is available for frontend
        $message->load('sender');

        // Broadcast via Websocket for real-time updates
        broadcast(new NewMessage($message))->toOthers();

        return back(); //Inertia will handle the update
    }
}
