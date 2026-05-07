<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Actions\Action;
use UnitEnum;
use Filament\Notifications\Notification;
use BackedEnum;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;

class SystemTool extends Page
{
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-wrench-screwdriver';
    protected static ?string $navigationLabel = 'System Tools';
    protected static ?string $title = 'System Tools';
    protected static string|UnitEnum|null $navigationGroup = 'Settings';
    protected string $view = 'filament.pages.system-tool';
    
    public function getHealthData(): array
    {
        $disk = $this->diskStats();
    
        return [
            [
                'label' => 'PHP',
                'value' => phpversion(),
                'icon' => 'heroicon-o-code-bracket',
                'status' => 'ok',
            ],
            [
                'label' => 'Laravel',
                'value' => app()->version(),
                'icon' => 'heroicon-o-cube',
                'status' => 'ok',
            ],
            [
                'label' => 'Cache',
                'value' => config('cache.default'),
                'icon' => 'heroicon-o-archive-box',
                'status' => 'ok',
            ],
            [
                'label' => 'Queue',
                'value' => config('queue.default'),
                'icon' => 'heroicon-o-queue-list',
                'status' => 'ok',
            ],
            [
                'label' => 'Disk',
                'value' => $disk['free_gb'] . ' GB free',
                'icon' => 'heroicon-o-circle-stack',
                'status' => $disk['status'],
                'disk' => $disk,
            ],
        ];
    }
    
    private function notifySuccess(string $message): void
    {
        Notification::make()
            ->title($message)
            ->success()
            ->send();
    }

    private function notifyError(\Throwable $e): void
    {
        Notification::make()
            ->title('Action failed')
            ->danger()
            ->body($e->getMessage())
            ->send();
    }
    
    public function clearConfig()
    {
        try {
            Artisan::call('config:clear');
            $this->notifySuccess('Config cache cleared');
        } catch (\Throwable $e) {
            $this->notifyError($e);
        }
    }

    public function clearRoute()
    {
        try {
            Artisan::call('route:clear');
            $this->notifySuccess('Route cache cleared');
        } catch (\Throwable $e) {
            $this->notifyError($e);
        }
    } 
    
    public function clearView()
    {
        try {
            Artisan::call('view:clear');
            $this->notifySuccess('View cache cleared');
        } catch (\Throwable $e) {
            $this->notifyError($e);
        }
    }

    public function clearCache()
    {
        try {
            Artisan::call('cache:clear');
            $this->notifySuccess('Application cache cleared');
        } catch (\Throwable $e) {
            $this->notifyError($e);
        }
    }

    public function restartQueue()
    {
        try {
            Artisan::call('queue:restart');
            $this->notifySuccess('Queue workers restarted');
        } catch (\Throwable $e) {
            $this->notifyError($e);
        }
    }
    
    // public function cleanStorage()
    // {
    //     try {
    //         Storage::disk('public')->deleteDirectory('generated');
    
    //         $this->notifySuccess('Generated files cleaned successfully');
    //     } catch (\Throwable $e) {
    //         $this->notifyError($e);
    //     }
    // }

    protected function getHeaderActions(): array
    {
        return [
        ];
    }
    
    protected function getViewData(): array
    {
        return [
            'health' => [
                'php' => phpversion(),
                'laravel' => app()->version(),
                'cache' => config('cache.default'),
                'queue' => config('queue.default'),
                'disk_free' => round(
                    disk_free_space(storage_path()) / 1024 / 1024 / 1024,
                    2
                ) . ' GB',
            ],
        ];
    }
        
    private function diskStats(): array
    {
        $path = storage_path();
    
        $total = disk_total_space($path);
        $free  = disk_free_space($path);
        $used  = $total - $free;
    
        $usedPercent = ($used / $total) * 100;
    
        return [
            'total_gb' => round($total / 1024 / 1024 / 1024, 2),
            'used_gb'  => round($used / 1024 / 1024 / 1024, 2),
            'free_gb'  => round($free / 1024 / 1024 / 1024, 2),
            'used_percent' => round($usedPercent, 1),
            'status' => $usedPercent < 70 ? 'ok' : ($usedPercent < 90 ? 'warning' : 'critical'),
        ];
    }

    // public static function canAccess(): bool
    // {
    //     return auth()->user()?->role === 'admin';
    // }

}
            