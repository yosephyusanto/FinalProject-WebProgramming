<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationHistoryController extends Controller
{
    // show all notification history
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->get();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    // mark single notification read
    public function read(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notification->markAsRead();

        return back();
    }

    // mark all notification read
    public function readAll(Request $request)
    {
        $request->user()
            ->unreadNotifications
            ->markAsRead();

        return back();
    }
}
