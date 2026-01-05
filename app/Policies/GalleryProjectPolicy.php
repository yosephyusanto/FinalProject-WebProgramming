<?php

namespace App\Policies;

use App\Models\GalleryProject;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GalleryProjectPolicy
{
    public function update(User $user, GalleryProject $project)
    {
        return $project->user_id === $user->id;
    }

    public function delete(User $user, GalleryProject $project)
    {
        return $project->user_id === $user->id;
    }
}
