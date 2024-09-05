<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ModelClass;
use App\Models\TestHeader;
use App\Models\Test;

class Project extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function modelClasses()
    {
        return $this->hasMany(ModelClass::class);
    }

    public function testHeaders()
    {
        return $this->hasMany(TestHeader::class);
    }

    public function tests()
    {
        return $this->hasMany(Test::class);
    }
}
