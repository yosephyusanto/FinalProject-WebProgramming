<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MaterialListing;
use App\Models\GalleryProject;

class GalleryProjectSeeder extends Seeder
{
    public function run(): void
    {
        $takers = User::where('role', 'taker')->get();
        $completedListings = MaterialListing::where('status', 'completed')->get();

        if($takers->isEmpty() || $completedListings->isEmpty()){
            $this->command->info('No takers or completed listings found');
            return;
        }

        $completedListings->take(10)->each(function ($listing) use ($takers) {
            GalleryProject::factory()
                ->count(rand(1, 3))
                ->for($takers->random())
                ->for($listing)
                ->create();
        });
    }
}
