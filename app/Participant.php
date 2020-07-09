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
      'group_code',
      'round_votes',
      'all_votes',
      'vote_to',
      'title',
      'photo_url',
      'photo_title',
      'short_desc',
      'photo_url2',
      'photo_title2',
      'long_desc',
      'link',
      'link_desc',
      'photo_url3',
      'photo_title3',
      'summary'
    ];
}
