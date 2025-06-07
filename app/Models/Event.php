<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_event',
        'slug',
        'deskripsi',
        'lokasi',
        'tanggal_event',
        'harga_tiket',
        'kuota',
        'gambar_event',
    ];
}