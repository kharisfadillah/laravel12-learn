<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasUlids;
    protected $fillable = ['code', 'name'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
