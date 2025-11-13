<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MCUFItem extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mcu_f_items';

    public function headers(): BelongsTo
    {
        return $this->belongsTo(MCUFHeader::class, 'header_id', 'id');
    }
}
