<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MCUFHeader extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mcu_f_headers';

    public function initial(): HasOne
    {
        return $this->hasOne(MCUIHeader::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(MCUFItem::class, 'header_id', 'id');
    }
}
