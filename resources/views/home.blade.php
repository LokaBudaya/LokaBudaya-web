<!-- resources/views/home.blade.php -->
<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Event Budaya Nusantara
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        @forelse ($events as $event)
                            <div class="border rounded-lg overflow-hidden">
                                <a href="{{ route('event.show', $event->slug) }}">
                                    <img src="{{ asset('storage/' . $event->gambar_event) }}" alt="{{ $event->nama_event }}" class="w-full h-48 object-cover">
                                    <div class="p-4">
                                        <h3 class="font-bold text-lg">{{ $event->nama_event }}</h3>
                                        <p class="text-sm text-gray-600">{{ $event->lokasi }} | {{ \Carbon\Carbon::parse($event->tanggal_event)->format('d M Y') }}</p>
                                        <p class="mt-2 font-bold text-green-600">Rp {{ number_format($event->harga_tiket, 0, ',', '.') }}</p>
                                    </div>
                                </a>
                            </div>
                        @empty
                            <p>Belum ada event yang tersedia saat ini.</p>
                        @endforelse
                    </div>
                    <div class="mt-8">
                        {{ $events->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>