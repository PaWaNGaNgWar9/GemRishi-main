<?php

namespace App\Filament\Resources\BlogCategories\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BlogCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Category Details')
                    ->schema([

                        TextInput::make('name')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) =>
                                $set('slug', \Illuminate\Support\Str::slug($state))
                            ),

                        TextInput::make('slug')
                            ->required(),

                        FileUpload::make('image')
                            ->image()
                            ->disk('public')
                            ->visibility('public')
                            ->directory('blog-categories')
                            ->columnSpanFull(),

                        Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),

                    ])
                    ->columns(2),
            ]);
    }
}
