<?php

namespace App\Enum;

enum VariationTypeOptionEnum: string
{
    case Image = "image";
    case Select = "select";
    case Radio = "radio";

    public static function labels(): array
    {
        return 
        [
            self::Image->value => "Image",
            self::Select->value => "Select",
            self::Radio->value => "Radio",
        ];
    }

}
