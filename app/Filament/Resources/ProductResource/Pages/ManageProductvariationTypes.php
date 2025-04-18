<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Enum\VariationTypeOptionEnum;
use App\Filament\Resources\ProductResource;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Pages\EditRecord;

class ManageProductVariationTypes extends EditRecord
{

  protected static string $resource = ProductResource::class;

  protected static ?string $title = "Variation Types";

  protected static ?string $navigationIcon = "heroicon-m-numbered-list";

  public function form(Form $form):Form
  {
    return $form->schema([
        Repeater::make("variationTypes")
        ->label(false)
        ->relationship()
        ->collapsible()
        ->defaultItems(1)
        ->addActionLabel("Add new variation type")
        ->columns(2)
        ->columnSpan(2)
        ->schema([
          TextInput::make("name")->required(),
          Select::make("type")->required()->options(VariationTypeOptionEnum::labels()),
          Repeater::make("options")
          ->relationship()
          ->collapsible()
          ->columnSpan(2)
          ->schema([
            TextInput::make("name")->required()->columnSpan(2),
            SpatieMediaLibraryFileUpload::make("images")
            ->label(false)
            ->image()
            ->multiple()
            ->openable()
            ->panelLayout("grid")
            ->collection("images")
            ->reorderable()
            ->appendFiles()
            ->preserveFilenames()
            ->columnSpan(2)
          ])
        ])
    ]);
  }

}