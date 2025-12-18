<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MaterialListing;

class MaterialListingSeeder extends Seeder
{

    public function run(): void
    {
        $givers = User::where('role', 'giver')->get();

        if($givers->isEmpty()) {
            $this->command->info('No giver users found');
            return;
        }

        // AVAILABLE (mayoritas)
        MaterialListing::factory()
            ->count(20)
            ->for($givers->random())
            ->available()
            ->create();

        // CLAIMED
        MaterialListing::factory()
            ->count(7)
            ->for($givers->random())
            ->claimed()
            ->create();

        // COMPLETED (impact counter)
        MaterialListing::factory()
            ->count(5)
            ->for($givers->random())
            ->completed()
            ->create();
    }
}
