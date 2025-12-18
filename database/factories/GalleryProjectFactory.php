<?php

namespace Database\Factories;

use App\Models\GalleryProject;
use App\Models\MaterialListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GalleryProject>
 */
class GalleryProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = GalleryProject::class;

    public function definition(): array
    {
        return [
            'title' => 'Upcycled ' . $this->faker->words(2, true),
            'description' => $this->faker->paragraph(),
        ];
    }
}
