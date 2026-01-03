<?php

namespace Database\Factories;

use App\Models\MaterialListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MaterialListing>
 */
class MaterialListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = MaterialListing::class;

    public function definition(): array
    {
        $pricing_type = $this->faker->randomElement(['fixed', 'negotiable', 'free']);

        return [
            'title' => $this->faker->randomElement([
                'Cotton Fabric Scraps',
                'Blue Leather Off-cuts',
                'Plywood Workshop Leftovers',
                'Acrylic Packaging Sheets',
                'Mixed Textile Remnants',
                'Old Wooden Pallets',
                'Used Plastic Containers',
                'Scrap Metal Pieces',
                'Glass Bottles',
                'Fabric Offcuts',
            ]),
            'description' => $this->faker->paragraph(),
            'material_type' => $this->faker->randomElement([
                'Plastic', 'Metal', 'Wood', 'Glass', 'Fabric', 'Leather', 'Paper', 'Composite'
            ]),
            'color' => $this->faker->safeColorName(),
            'estimated_weight' => $this->faker->randomFloat(2, 1, 50),
            'estimated_volume' => $this->faker->optional()->randomElement([
                '0.5 m3', '1 m3', '2 m3', '3 m3', '4 m3', '5 m3'
            ]),
            'condition' => $this->faker->randomElement([
                'good', 'used', 'damaged'
            ]),
            'location' => $this->faker->city(),
            'status' => 'available',
            'pricing_type' => $pricing_type,
            'price' => $pricing_type === 'free' ? 0 : $this->faker->randomFloat(2, 10000, 1000000),
            'currency' => 'IDR',
            'stock' => $this->faker->numberBetween(1, 20),
            'is_active' => true,
            'pickup_window_start' => now()->addDays(rand(1, 3)),
            'pickup_window_end' => now()->addDays(rand(4, 7)),

        ];
    }

    public function available()
    {
        return $this->state(fn () => [
            'status' => 'available',
            'is_active' => true,
        ]);
    }

    public function claimed()
    {
        return $this->state(fn () => [
            'status' => 'claimed',
            'is_active' => true,
            'stock' => 0,
        ]);
    }

    public function completed()
    {
        return $this->state(fn () => [
            'status' => 'completed',
            'is_active' => false,
        ]);
    }
}
