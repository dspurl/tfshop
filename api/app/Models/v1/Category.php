<?php

namespace App\Models\v1;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string name
 * @property int sort
 * @property int pid
 * @property int state
 * @property string resources
 * @property int is_recommend
 */
class Category extends Model
{
    public static $withoutAppends = false;
    const CATEGORY_STATE_YES= 0; //状态：正常
    const CATEGORY_STATE_NO= 1; //状态：隐藏
    const CATEGORY_IS_RECONMEND_NO= 0; //首页推荐：否
    const CATEGORY_IS_RECONMEND_YES= 1; //首页推荐：是
    protected $table = 'categorys';

    protected $appends = ['state_show'];

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getStateShowAttribute(){
        if(isset($this->attributes['state'])){
            if(self::$withoutAppends){
                return ' ';
            }else{
                if($this->attributes['state'] == static::CATEGORY_STATE_YES){
                    return '显示';
                }else if($this->attributes['state'] == static::CATEGORY_STATE_NO){
                    return '隐藏';
                }
            }
        }
    }
    /**
     * 获取分类图片
     */
    public function resources(){
        return $this->morphOne('App\Models\v1\Resource', 'image');
    }

    /**
     * 获取父分类
     */
    public function  Category(){
        return $this->hasOne('App\Models\v1\Category', 'id','pid');
    }

    /**
     * 已选的规格
     */
    public function SpecificationOn(){
        return $this->belongsToMany(Specification::class,'category_specifications');
    }

    /**
     * 已选的品牌
     */
    public function BrandOn(){
        return $this->belongsToMany(Brand::class,'category_brands');
    }

    /**
     * 获取所有的分类
     */
    protected function getAllCategory(){
        $Category=static::get();
        $options = [];
        if($Category){
            foreach ($Category as $p){
                $options[]=array(
                    'value'=>$p['id'],
                    'label'=>$p['name'],
                    'pid'=>$p['pid'],
                    'id'=>$p['id']
                );
            }
            return collect(genTree($options,'pid'))->prepend(array(
                'value'=>0,
                'label'=>'顶级分组'
            ));
        }else {
            return true;
        }

    }
}
