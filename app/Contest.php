<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contest extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'category_id',
        'creator_id',
        'name',
        'url',
        'round_days',
        'allow_video',        
        'start_date',
        'end_date',
        'gole',
        'rule',
        'ending',
        'note',
        'status'
    ];
}
