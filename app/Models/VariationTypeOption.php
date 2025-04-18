<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class VariationTypeOption extends Model implements HasMedia
{
    //
    use InteractsWithMedia;

    public $timestamps = false;


    public function registerMediaConversions(?Media $media = null): void
    {
        $this->getMediaConversion('thumb')->width(100);
        $this->getMediaConversion('small')->width(480);
        $this->getMediaConversion('large')->width(1200);
    }
}
