<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class AuthGroupAuthRule extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;
    protected $fillable = ['auth_group_id', 'auth_rule_id'];

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
