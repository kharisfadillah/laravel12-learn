<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MCUIItem extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mcu_i_items';

    public function headers(): BelongsTo
    {
        return $this->belongsTo(MCUIHeader::class, 'header_id', 'id');
    }
}
