<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enum\RolesEnum;
use App\Enum\VendorStatusEnum;
use App\Models\Vendor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            "name"=> "user",
            "email" => "user@gmail.com",
        ])->assignRole(RolesEnum::User->value);
        $vendor = User::factory()->create([
            "name"=> "vendor",
            "email" => "vendor@gmail.com",
        ])->assignRole(RolesEnum::Vendor->value);

        Vendor::create([
            "user_id" => $vendor->id,
            "status" => VendorStatusEnum::Approved->value,
            "store_name" => "Vendor Store",
            "store_address" => fake()->address,
        ]);

        User::factory()->create([
            "name"=> "admin",
            "email" => "admin@gmail.com",
        ])->assignRole(RolesEnum::Admin->value);
    }
}
