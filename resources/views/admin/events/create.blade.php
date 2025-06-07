<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Tambah Event Baru') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">

                    {{-- Menampilkan error validasi jika ada --}}
                    @if ($errors->any())
                        <div class="mb-4">
                            <div class="font-medium text-red-600">{{ __('Whoops! Something went wrong.') }}</div>

                            <ul class="mt-3 list-disc list-inside text-sm text-red-600">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf

                        <!-- Nama Event -->
                        <div class="mt-4">
                            <x-input-label for="nama_event" :value="__('Nama Event')" />
                            <x-text-input id="nama_event" class="block mt-1 w-full" type="text" name="nama_event" :value="old('nama_event')" required autofocus />
                            <x-input-error :messages="$errors->get('nama_event')" class="mt-2" />
                        </div>
                        
                        <!-- Deskripsi -->
                        <div class="mt-4">
                            <x-input-label for="deskripsi" :value="__('Deskripsi')" />
                            <textarea id="deskripsi" name="deskripsi" class="block mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">{{ old('deskripsi') }}</textarea>
                            <x-input-error :messages="$errors->get('deskripsi')" class="mt-2" />
                        </div>

                        <!-- Lokasi -->
                        <div class="mt-4">
                            <x-input-label for="lokasi" :value="__('Lokasi')" />
                            <x-text-input id="lokasi" class="block mt-1 w-full" type="text" name="lokasi" :value="old('lokasi')" required />
                            <x-input-error :messages="$errors->get('lokasi')" class="mt-2" />
                        </div>
                        
                        <!-- Tanggal Event -->
                        <div class="mt-4">
                            <x-input-label for="tanggal_event" :value="__('Tanggal Event')" />
                            <x-text-input id="tanggal_event" class="block mt-1 w-full" type="datetime-local" name="tanggal_event" :value="old('tanggal_event')" required />
                            <x-input-error :messages="$errors->get('tanggal_event')" class="mt-2" />
                        </div>

                        <!-- Harga Tiket -->
                        <div class="mt-4">
                            <x-input-label for="harga_tiket" :value="__('Harga Tiket (Rp)')" />
                            <x-text-input id="harga_tiket" class="block mt-1 w-full" type="number" name="harga_tiket" :value="old('harga_tiket')" required />
                            <x-input-error :messages="$errors->get('harga_tiket')" class="mt-2" />
                        </div>

                        <!-- Kuota -->
                        <div class="mt-4">
                            <x-input-label for="kuota" :value="__('Kuota')" />
                            <x-text-input id="kuota" class="block mt-1 w-full" type="number" name="kuota" :value="old('kuota')" required />
                            <x-input-error :messages="$errors->get('kuota')" class="mt-2" />
                        </div>

                        <!-- Gambar Event -->
                        <div class="mt-4">
                            <x-input-label for="gambar_event" :value="__('Gambar Event')" />
                            <input type="file" id="gambar_event" name="gambar_event" class="block mt-1 w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                            <x-input-error :messages="$errors->get('gambar_event')" class="mt-2" />
                        </div>

                        <div class="flex items-center justify-end mt-4">
                            <a href="{{ route('admin.events.index') }}" class="text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Batal
                            </a>

                            <x-primary-button class="ms-4">
                                {{ __('Simpan Event') }}
                            </x-primary-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>