<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Menampilkan halaman utama dengan semua event.
     */
    public function index()
    {
        $events = Event::latest()->paginate(9);
        return view('home', compact('events'));
    }

    /**
     * Menampilkan detail dari satu event.
     */
    public function show($slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();
        return view('event.show', compact('event'));
    }
}