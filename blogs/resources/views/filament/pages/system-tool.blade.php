        <x-filament::page>

    {{-- ================= SYSTEM HEALTH ================= --}}
    <x-filament::section
        heading="System Health"
        description="Live server & application status"
    >
    
        {{-- auto refresh --}}
        <!--<meta http-equiv="refresh" content="30">-->
    
    
            @foreach ($this->getHealthData() as $item)
                @php
                    $color = match($item['status']) {
                        'ok' => '#22c55e',
                        'warning' => '#f59e0b',
                        'critical' => '#ef4444',
                        default => '#6b7280',
                    };
                @endphp
    
                <div style="
                    display:inline-block;
                    vertical-align:top;
                    width:260px;
                    margin-right:16px;
                    margin-bottom:16px;
                ">

                        <div style="
                            padding:16px;
                            border-left:6px solid {{ $color }};
                            border-radius:12px;
                            background:#f9fafb;
                        ">
    
                            {{-- header --}}
                            <div style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                margin-bottom:10px;
                            ">
                                <span style="
                                    font-size:12px;
                                    font-weight:600;
                                    color:#6b7280;
                                    text-transform:uppercase;
                                ">
                                    {{ $item['label'] }}
                                </span>
    
                                <span style="
                                    height:10px;
                                    width:10px;
                                    background:{{ $color }};
                                    border-radius:50%;
                                    display:inline-block;
                                "></span>
                            </div>
    
                            {{-- value --}}
                            <div style="
                                font-size:22px;
                                font-weight:700;
                                color:#111827;
                                margin-bottom:8px;
                            ">
                                {{ $item['value'] }}
                            </div>
    
                            {{-- disk progress --}}
                            @if(isset($item['disk']))
                                <div style="
                                    height:6px;
                                    background:#e5e7eb;
                                    border-radius:4px;
                                    overflow:hidden;
                                    margin-bottom:6px;
                                ">
                                    <div style="
                                        width:{{ $item['disk']['used_percent'] }}%;
                                        background:{{ $color }};
                                        height:100%;
                                    "></div>
                                </div>
    
                                <div style="
                                    font-size:12px;
                                    color:#6b7280;
                                ">
                                    Used {{ $item['disk']['used_percent'] }}%
                                    ({{ $item['disk']['used_gb'] }} / {{ $item['disk']['total_gb'] }} GB)
                                </div>
                            @endif
    
                            {{-- footer --}}
                            <div style="
                                margin-top:8px;
                                font-size:11px;
                                color:#6b7280;
                                display:flex;
                                align-items:center;
                                gap:6px;
                            ">
                                <x-filament::icon
                                    :name="$item['icon']"
                                    class="h-4 w-4"
                                />
                                Live · auto refresh
                            </div>
    
                        </div>

                </div>
            @endforeach
    
    
    </x-filament::section>

    {{-- ================= CACHE & QUEUE ================= --}}
    <x-filament::section
        heading="Cache & Queue"
        description="Clear cache and manage workers"
        icon="heroicon-o-bolt"
    >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            {{-- Cache --}}
            <x-filament::card>
                <p class="font-semibold mb-4">Cache Management</p>
                <br />
                <div class="flex flex-wrap gap-3">
                    <x-filament::button wire:click="clearConfig" wire:loading.attr="disabled">
                        <span wire:loading.remove wire:target="clearConfig">Clear Config</span>
                        <span wire:loading wire:target="clearConfig">Working...</span>
                    </x-filament::button>

                    <x-filament::button wire:click="clearRoute" wire:loading.attr="disabled">
                        <span wire:loading.remove wire:target="clearRoute">Clear Routes</span>
                        <span wire:loading wire:target="clearRoute">Working...</span>
                    </x-filament::button>

                    <x-filament::button wire:click="clearView" wire:loading.attr="disabled">
                        <span wire:loading.remove wire:target="clearView">Clear Views</span>
                        <span wire:loading wire:target="clearView">Working...</span>
                    </x-filament::button>

                    <x-filament::button
                        color="danger"
                        wire:click="clearCache"
                        wire:loading.attr="disabled"
                    >
                        <span wire:loading.remove wire:target="clearCache">Clear App Cache</span>
                        <span wire:loading wire:target="clearCache">Working...</span>
                    </x-filament::button>
                </div>
            </x-filament::card>
                <br />
            {{-- Queue --}}
            {{-- <x-filament::card>
                <p class="font-semibold mb-4">Queue</p>
                <br />
                <x-filament::button
                    color="warning"
                    icon="heroicon-o-arrow-path"
                    wire:click="restartQueue"
                    wire:loading.attr="disabled"
                >
                    <span wire:loading.remove wire:target="restartQueue">
                        Restart Queue Workers
                    </span>
                    <span wire:loading wire:target="restartQueue">
                        Restarting...
                    </span>
                </x-filament::button>
            </x-filament::card> --}}

        </div>
    </x-filament::section>

</x-filament::page>
        