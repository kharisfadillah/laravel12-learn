<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class MCUParameter extends Model
{
    use HasUlids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mcu_parameters';

    protected $fillable = [
        'category_id',
        'name',
        'input_type',
        'unit',
        'ranges',
        'options',
        'is_active',
    ];

    protected $casts = [
        'ranges' => 'array',
        'options' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(MCUCategory::class, 'category_id', 'id');
    }
}
