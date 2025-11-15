<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MCUIHeader extends Model
{
    use HasUlids;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mcu_i_headers';

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'participant_id', 'id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(MCUIItem::class, 'header_id', 'id');
    }

    public function followup(): HasOne
    {
        return $this->hasOne(MCUFHeader::class, 'initial_id', 'id');
    }
}
