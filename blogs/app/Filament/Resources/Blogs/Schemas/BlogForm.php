<?php

namespace App\Filament\Resources\Blogs\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Illuminate\Support\Str;
use Filament\Schemas\Schema;

class BlogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([



                Section::make('Basic Information')
                    ->schema([

                        TextInput::make('title')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) =>
                                $set('slug', Str::slug($state))
                            ),

                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true),

                        Select::make('blog_category_id')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Textarea::make('excerpt')
                            ->rows(4),

                        RichEditor::make('content')
                            ->required()
                            ->toolbarButtons([
                                        		'blockquote',
                                                'bold',
                                                'bulletList',
                                                'codeBlock',
                                                'h2',
                                                'h3',
                                                'italic',
                                                'link',
                                                'orderedList',
                                                'redo',
                                                'strike',
                                                'underline',
                                        ])
                            ->columnSpanFull(),

                    ])
                    ->columns(2),

                Grid::make()
                    ->schema([

                        Section::make('Media')
                            ->schema([

                                Grid::make(2)
                                    ->schema([

                                        FileUpload::make('featured_image')
                                            ->image()
                                            ->disk('public')
                                            ->visibility('public')
                                            ->directory('blogs'),

                                        FileUpload::make('banner_image')
                                            ->image()
                                            ->disk('public')
                                            ->visibility('public')
                                            ->directory('blogs'),

                                    ]),

                                TextInput::make('featured_image_alt')
                                    ->label('Featured Image Alt Text')
                                    ->columnSpanFull(),

                            ])
                            ->columnSpanFull(),

                        Section::make('Tags')
                            ->schema([

                                TagsInput::make('tags'),

                            ])
                            ->columnSpanFull(),
                            
                    ])
                    ->columns(2),    

                Section::make('SEO')
                    ->schema([

                        TextInput::make('meta_title')
                            ->maxLength(60)
                            ->helperText('Recommended: 50–60 characters'),

                        Textarea::make('meta_description')
                            ->maxLength(160)
                            ->rows(4)
                            ->helperText('Recommended: 150–160 characters'),

                        TextInput::make('meta_keywords')
                            ->helperText('Comma separated keywords'),

                        FileUpload::make('og_image')
                            ->image()
                            ->disk('public')
                            ->visibility('public')
                            ->directory('blogs/seo'),

                        Toggle::make('indexable')
                            ->default(true)
                            ->helperText('Allow search engines to index this blog'),

                    ])
                    ->columns(2),

                Section::make('Publishing')
                    ->schema([

                        Toggle::make('is_published')
                            ->default(true),

                        DateTimePicker::make('published_at')
                            ->default(now()),

                        Toggle::make('is_featured')
                            ->default(false),

                    ])
                    ->columns(2),



            ]);
    }
}
