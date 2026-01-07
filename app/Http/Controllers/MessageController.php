<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\NewMessage;
use Inertia\Inertia;

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

    public function index(Request $request){
        $user = $request->user();
        
        //Get all claims for all users (Giver or Taker)
        $claims = Claim::where(function($query) use ($user){
            $query->where('claimed_by_user_id', $user->id)
            ->orWhereHas('materialListing', function($q) use ($user){
                $q->where('user_id', $user->id);
            });
        })->with(['materialListing.photos', 'materialListing.user', 'claimedBy', 'messages' => function($q){
            $q->latest()->limit(1);
        }])
        ->withCount('messages')->orderBy('updated_at', 'desc')->paginate(12);
        
        return Inertia::render('Messages/Index', ['claims' => $claims]);
    }
}
