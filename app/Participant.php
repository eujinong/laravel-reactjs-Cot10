<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      'member_id',
      'contest_id',
      'title',
      'group_code',
      'round_votes',
      'all_votes',
      'vote_to',
      'media1',
      'media2',
      'media3',
      'media4',
      'media5',
      'media6',
      'media7',
      'media8',
      'media9',
      'media10'
    ];
}
