<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PasswordReset extends Model
{
    //
    protected $fillable = [
        'email', 'token'
    ];

    protected $primaryKey = 'email';
    public $incrementing = false;

    public $timestamps = false;

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->created_at = $model->freshTimestamp();
        });
    }

    public function isExpired()
    {
        return false;
    }

    public function user()
    {
        return $this->hasOne('\App\User', 'email', 'email');
    }
}
