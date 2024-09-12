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
        Schema::create('test_headers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')
            ->constrained()
            ->onUpdate('cascade')
            ->onDelete('cascade');
            $table->string('name', length: 255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_headers');
    }
};
