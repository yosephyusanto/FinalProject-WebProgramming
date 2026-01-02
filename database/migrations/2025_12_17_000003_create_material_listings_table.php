<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('material_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('material_type');
            $table->string('color')->nullable();
            $table->decimal('estimated_weight', 8, 2)->nullable();
            $table->string('estimated_volume')->nullable();
            $table->string('condition');
            $table->string('location');
            $table->enum('status', ['available', 'claimed', 'completed'])->default('available');
            $table->decimal('price', 12, 2)->nullable();
            $table->enum('pricing_type', ['fixed', 'negotiable', 'free'])->default('fixed');
            $table->string('currency', 3)->default('IDR');
            $table->integer('stock')->default(1);
            $table->boolean('is_active')->default(true);
            $table->datetime('pickup_window_start')->nullable();
            $table->datetime('pickup_window_end')->nullable();
            $table->timestamps();

            // Indexes for performances
            $table->index(['status', 'created_at']);
            $table->index(['material_type', 'location']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_listings');
    }
};
