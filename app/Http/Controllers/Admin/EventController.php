<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::latest()->get();
        return view('admin.events.index', compact('events'));
    }

    public function create()
    {
        return view('admin.events.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_event' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'lokasi' => 'required|string|max:255',
            'tanggal_event' => 'required|date',
            'harga_tiket' => 'required|integer|min:0',
            'kuota' => 'required|integer|min:0',
            'gambar_event' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('gambar_event')) {
            $path = $request->file('gambar_event')->store('events', 'public');
        }

        Event::create([
            'nama_event' => $request->nama_event,
            'slug' => Str::slug($request->nama_event) . '-' . time(),
            'deskripsi' => $request->deskripsi,
            'lokasi' => $request->lokasi,
            'tanggal_event' => $request->tanggal_event,
            'harga_tiket' => $request->harga_tiket,
            'kuota' => $request->kuota,
            'gambar_event' => $path,
        ]);

        return redirect()->route('admin.events.index')->with('success', 'Event berhasil ditambahkan!');
    }

    // Lanjutkan dengan method edit, update, dan destroy
    // ...
}