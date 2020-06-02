<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'password',
        'profile_image',
        'gender',
        'number',
        'email',
        'country',
        'state',
        'county',
        'city',
        'zip_code',
        'street',
        'building',
        'apartment'
    ];
}
