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
        Schema::create('provinces', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('code')->nullable();
            $table->string('name');
            $table->foreignUlid('created_id')
                ->nullable()
                ->constrained('users', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('updated_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->foreignUlid('deleted_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('regencies', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('province_id')
                ->constrained('provinces', 'id')
                ->restrictOnDelete();
            $table->string('code')->nullable();
            $table->string('name');
            $table->foreignUlid('created_id')
                ->nullable()
                ->constrained('users', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('updated_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->foreignUlid('deleted_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('company_id')
                ->constrained('companies', 'id')
                ->restrictOnDelete();
            $table->string('code')->nullable();
            $table->string('name');
            $table->foreignUlid('created_id')
                ->nullable()
                ->constrained('users', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('updated_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->foreignUlid('deleted_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('participants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('company_id')
                ->constrained('companies', 'id')
                ->restrictOnDelete();
            $table->string('code')->nullable();
            $table->string('name');
            $table->string('position')->nullable();
            $table->foreignUlid('department_id')
                ->constrained('departments', 'id')
                ->restrictOnDelete();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['Laki-laki', 'Perempuan']);
            $table->string('phone')->nullable();
            $table->foreignUlid('created_id')
                ->nullable()
                ->constrained('users', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('updated_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->foreignUlid('deleted_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('regencies');
        Schema::dropIfExists('provinces');
    }
};
