<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    case ManageVendors = "manage_vendors";
    case SellProducts = "sell_products";
    case BuyProducts = "buy_products";
}
