<?php

namespace App\Filament\Resources;

use App\Enum\ProductStatusEnum;
use App\Enum\RolesEnum;
use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\Pages\EditProduct;
use App\Filament\Resources\ProductResource\Pages\ManageImages;
use App\Filament\Resources\ProductResource\Pages\ManageProductVariations;
use App\Filament\Resources\ProductResource\Pages\ManageProductVariationTypes;
use App\Models\Product;
use Filament\Facades\Filament;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::End;

    public static function getEloquentQuery():Builder
    {
        return parent::getEloquentQuery()->forVendor();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Grid::make()->schema([
                    TextInput::make("name")
                    ->live(onBlur: true)
                    ->required()
                    ->afterStateUpdated(function(string $operation, $state,callable $set)
                    {
                        return $set("slug", Str::slug($state));
                    }),
                    TextInput::make("slug")->required(),
                    Select::make("department_id")
                    ->relationship("department", "name")
                    ->label("Department")
                    ->preload()
                    ->searchable()
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function(callable $set) 
                    {
                        return $set("category_id", null);
                    }),
                    Select::make("category_id")
                    ->relationship("category", "name",function(Builder $query, callable $get)
                    {
                        $departmentId = $get("department_id");
                        if($departmentId){
                            return $query->where("department_id", $departmentId);
                        }
                    })
                    ->label("Category")
                    ->searchable()
                    ->required()
                    ->preload()
                ]),
                RichEditor::make("description")
                ->required()
                ->columnSpan(2)
                ->toolbarButtons([
                    "blockquote",
                    "bold",
                    "bulletList",
                    "h2",
                    "h3",
                    "italic",
                    "link",
                    "orderList",
                    "redo",
                    "strike",
                    "underline",
                    "undo",
                    "table"
                ]),
                TextInput::make("price")
                ->required()
                ->numeric(),
                TextInput::make("quantity")
                ->integer(),
                Select::make("status")
                ->options(ProductStatusEnum::labels())
                ->default(ProductStatusEnum::Draft->value)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make("images")
                ->collection("images")
                ->limit(1)
                ->label("image")
                ->conversion('thumb'),
                TextColumn::make("name")
                ->words(10)
                ->sortable()
                ->searchable(),
                TextColumn::make("status")
                ->badge()
                ->sortable()
                ->colors(ProductStatusEnum::colors()),
                TextColumn::make("department.name")
                ->sortable()
                ->searchable(),
                TextColumn::make("category.name")
                ->sortable()
                ->searchable(),
                TextColumn::make("created_at")
                ->dateTime()
            ])
            ->filters([
                SelectFilter::make("status")
                ->options(ProductStatusEnum::labels()),
                SelectFilter::make("department_id")
                ->relationship("department", "name")
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                DeleteAction::make()
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
            "images" => Pages\ManageImages::route('/{record}/images'),
            "variation-types" => Pages\ManageProductVariationTypes::route('/{record}/variation-types'),
            "product-variations" => Pages\ManageProductVariations::route('/{record}/variations')
        ];
    }

    public static function getRecordSubNavigation(Page $page):array
    {
        return $page->generateNavigationItems([
            EditProduct::class,
            ManageImages::class,
            ManageProductVariationTypes::class,
            ManageProductVariations::class
        ]);
    }


    public static function canViewAny():bool
    {
        $user = Filament::auth()->user();
        return $user && $user->hasRole(RolesEnum::Vendor);
    }
}
