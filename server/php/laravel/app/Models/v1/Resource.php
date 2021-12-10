<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int resource_type_id
 * @property int resource_group_id
 * @property string name
 * @property string depict
 * @property string url
 * @property array info
 */
class Resource extends Model
{

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

    public function getInfoAttribute()
    {
        if (isset($this->attributes['info'])) {
            return json_decode($this->attributes['info']);
        } else {
            return [];
        }
    }

    public function setInfoAttribute($value)
    {
        $this->attributes['info'] = json_encode($value);
    }

    public function create($request)
    {
        $Resource = new Resource;
        $Resource->resource_type_id = $request['resource_type_id'];
        $Resource->resource_group_id = $request['resource_group_id'];
        $Resource->name = $request['name'];
        $Resource->depict = '';
        $Resource->url = $request['url'];
        $Resource->info = $request['info'];
        $Resource->save();
        return $Resource;
    }

    public function ResourceType()
    {
        return $this->belongsTo(ResourceType::class);
    }
}
