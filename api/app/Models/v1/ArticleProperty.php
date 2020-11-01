<?php

namespace App\Models\v1;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int article_id
 * @property string details
 */
class ArticleProperty extends Model
{
    protected $table = 'article_propertys';
}
