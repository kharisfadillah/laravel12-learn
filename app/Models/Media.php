<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasUlids;

    protected $fillable = [
        'model_type',
        'model_id',
        'collection',
        'name',
        'file_name',
        'mime_type',
        'disk',
        'size',
        'url',
    ];

    // Polymorphic
    public function model()
    {
        return $this->morphTo();
    }

    public function getFullUrlAttribute()
    {
        return Storage::disk($this->disk)->url($this->file_name);
    }
}
