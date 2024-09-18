<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

    public function testHeader()
    {
        return $this->belongsTo(TestHeader::class);
    }

    protected $guarded = ['id'];
}
