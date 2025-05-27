<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommunityRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('community_roles')->insert([
            ['name' => 'owner', 'label' => 'Propietario'],
            ['name' => 'admin', 'label' => 'Administrador'],
            ['name' => 'member', 'label' => 'Miembro'],
            ['name' => 'pending', 'label' => 'Pendiente'],
        ]);

    }
}
