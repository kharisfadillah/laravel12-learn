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
            $table->string('name');
            $table->string('position')->nullable();
            $table->foreignUlid('department_id')
                ->constrained('departments', 'id')
                ->restrictOnDelete();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female']);
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

        Schema::create('providers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->foreignUlid('province_id')
                ->nullable()
                ->constrained('provinces', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('regency_id')
                ->nullable()
                ->constrained('regencies', 'id')
                ->restrictOnDelete();
            $table->longText('address')->nullable();
            $table->string('phone', 15)->nullable();
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

        Schema::create('mcu_categories', function (Blueprint $table) {
            $table->ulid('id')->primary();
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

        Schema::create('mcu_parameters', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('category_id')
                ->nullable()
                ->constrained('mcu_categories', 'id')
                ->restrictOnDelete();
            $table->string('name');
            $table->enum('input_type', ['Angka', 'Teks Bebas', 'Pilihan']);
            $table->string('unit')->nullable();
            $table->json('ranges')->nullable();
            $table->json('options')->nullable();
            $table->boolean('is_active')->default(true);
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

        Schema::create('mcu_i_headers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('company_id')
                ->constrained('companies', 'id')
                ->restrictOnDelete();
            $table->string('mcu_type');
            $table->date('mcu_date');
            $table->foreignUlid('participant_id')
                ->constrained('participants', 'id')
                ->restrictOnDelete();
            $table->string('name');
            $table->string('position')->nullable();
            $table->foreignUlid('department_id')
                ->nullable()
                ->constrained('departments', 'id')
                ->restrictOnDelete();
            $table->string('department_code')->nullable();
            $table->string('department_name')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->string('phone')->nullable();
            $table->foreignUlid('provider_id')
                ->nullable()
                ->constrained('providers', 'id')
                ->restrictOnDelete();
            $table->enum('conclusion', ['FIT TO WORK', 'FIT WITH NOTE', 'TEMPORARY UNFIT', 'UNFIT'])
                ->nullable();
            $table->longText('recommendation')->nullable();
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

        Schema::create('mcu_i_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('header_id')
                ->constrained('mcu_i_headers', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('category_id')
                ->constrained('mcu_categories', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('parameter_id')
                ->constrained('mcu_parameters', 'id')
                ->restrictOnDelete();
            $table->string('name');
            $table->enum('input_type', ['Angka', 'Teks Bebas', 'Pilihan']);
            $table->string('unit')->nullable();
            $table->json('ranges')->nullable();
            $table->json('options')->nullable();
            $table->string('result');
            $table->string('notes')->nullable();
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

        Schema::create('mcu_f_headers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('initial_id')
                ->constrained('mcu_i_headers', 'id')
                ->restrictOnDelete();
            $table->date('mcu_date');
            $table->foreignUlid('provider_id')
                ->nullable()
                ->constrained('providers', 'id')
                ->restrictOnDelete();
            $table->enum('conclusion', ['FIT TO WORK', 'FIT WITH NOTE', 'TEMPORARY UNFIT', 'UNFIT'])
                ->nullable();
            $table->longText('recommendation')->nullable();
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

        Schema::create('mcu_f_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('header_id')
                ->constrained('mcu_f_headers', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('category_id')
                ->constrained('mcu_categories', 'id')
                ->restrictOnDelete();
            $table->foreignUlid('parameter_id')
                ->constrained('mcu_parameters', 'id')
                ->restrictOnDelete();
            $table->string('name');
            $table->enum('input_type', ['Angka', 'Teks Bebas', 'Pilihan']);
            $table->string('unit')->nullable();
            $table->decimal('l_min_value')->nullable();
            $table->decimal('p_min_value')->nullable();
            $table->decimal('l_max_value')->nullable();
            $table->decimal('p_max_value')->nullable();
            $table->decimal('result_number')->nullable();
            $table->string('result_text')->nullable();
            $table->string('result_description')->nullable();
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

        Schema::create('media', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('model_type');
            $table->ulid('model_id');
            $table->string('collection');
            $table->string('name');
            $table->string('file_name');
            $table->string('mime_type')->nullable();
            $table->string('disk', 50)->default('public');
            $table->unsignedBigInteger('size')->nullable();
            $table->text('url')->nullable();
            $table->timestamps();

            $table->index(['model_type', 'model_id']);
            $table->index('collection');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('mcu_f_items');
        Schema::dropIfExists('mcu_f_headers');
        Schema::dropIfExists('mcu_i_items');
        Schema::dropIfExists('mcu_i_headers');
        Schema::dropIfExists('mcu_parameters');
        Schema::dropIfExists('mcu_categories');
        Schema::dropIfExists('providers');
        Schema::dropIfExists('participants');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('regencies');
        Schema::dropIfExists('provinces');
    }
};
