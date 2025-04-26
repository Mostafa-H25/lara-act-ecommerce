<?php

namespace App\Enum;

enum VendorStatusEnum: string
{
    case Pending="pending";
    case Approved="approved";
    case Rejected="rejected";

    public function label():string
    {
        return match($this){
            self::Pending->value => "Pending",
            self::Approved->value => "Approved",
            self::Rejected->value => "Rejected",
        };
    }
    public static function labels(){
        return [
            self::Pending->value => "Pending",
            self::Approved->value => "Approved",
            self::Rejected->value => "Rejected",
        ];
    }

    public static function colors():array
    {
        return [
            'gray' => self::Pending->value,
            'success' => self::Approved->value,
            'danger' => self::Rejected->value,
        ];
    }
}
