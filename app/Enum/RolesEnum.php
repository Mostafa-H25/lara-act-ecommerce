<?php

namespace App\Enum;

enum RolesEnum:string
{
    case Admin = "admin";
    case Vendor = "vendor";
    case User = "user";
}
