<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Regency extends Model
{
    use HasUlids;
    protected $fillable = ['province_id', 'regency_code', 'regency_name'];

    public function province()
    {
        return $this->belongsTo(Province::class);
    }
}
