<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestHeader extends Model
{
    use HasFactory;

    public function tests()
    {
        return $this->hasMany(Test::class);
    }

    protected $guarded = ['id'];
}
