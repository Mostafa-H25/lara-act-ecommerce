<?php

namespace App\Models;

use App\Enum\ProductStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;

    public function scopeForVendor(Builder $query):Builder
    {
        return $query->where("created_by", auth()->user()->id);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where("status", ProductStatusEnum::Published);
    }

    public function scopeForWebsite(Builder $query): Builder
    {
        return $query->published();
    }

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class, "created_by");
    }

    public function department():BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
    public function category():BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variationTypes():HasMany
    {
        return $this->hasMany(VariationType::class);
    }
    public function variations():HasMany
    {
        return $this->hasMany(ProductVariation::class, "product_id");
    }

    public function getPriceForOptions($optionIds = []):float
    {
        $optionIds = array_values($optionIds);
        sort($optionIds);

        foreach($this->variations as $variation) {
             $a  = $variation->variation_type_option_ids;
            sort($a);

            if($optionIds == $a) {
                return $variation->price !== null ? $variation->price : $this->price;
            }
        }
        return $this->price;
    }

    public function getImageForOptions(array |null $optionIds = null) 
    {
        if($optionIds) {
            $optionIds = array_values($optionIds);
            $options = VariationTypeOption::whereIn("id", $optionIds)->get();

            foreach($options as $option) {
                $image = $option->getFirstMediaUrl('images', 'small');
                if($image) {
                    return $image;
                }
            }
        }
        return $this->getFirstMediaUrl('images', 'small');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        try {
        $this->addMediaConversion("thumb")->width(100)->format('jpg');
        $this->addMediaConversion("small")->width(480)->format('jpg');
        $this->addMediaConversion("large")->width(1200)->format('jpg');
    } catch (\Exception $e) {
        Log::error('Media conversion error: ' . $e->getMessage());
    }
    }

}
