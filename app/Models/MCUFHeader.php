<?php

namespace App\Models;

use App\Models\Traits\HasMedia;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MCUFHeader extends Model
{
    use HasUlids;
    use HasMedia;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mcu_f_headers';
    protected $guarded = ['id'];

    public function initial(): HasOne
    {
        return $this->hasOne(MCUIHeader::class, 'initial_id', 'id');
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(MCUFItem::class, 'header_id', 'id');
    }

    public function attachments()
    {
        return $this->morphMany(Media::class, 'model')
            ->where('collection', 'attachments');
    }
}
