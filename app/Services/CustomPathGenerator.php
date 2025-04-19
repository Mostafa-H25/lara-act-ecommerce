<?php

namespace App\Services;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class CustomPathGenerator implements PathGenerator
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getPath(Media $media): string
    {
        // return md5($media->id . config("app.key"));
        return "media/{$media->id}/";
    }

    public function getPathForConversions(Media $media): string
    {
        // return md5($media->id . config("app.key") . "/conversions/");
        return "media/{$media->id}/conversions/";

    }

    public function getPathForResponsiveImages(Media $media): string
    {
        // return md5($media->id . config("app.key") . "/responsive/");
        return "media/{$media->id}/responsive/";

    }
}
