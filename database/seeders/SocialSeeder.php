<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SocialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('socials')->insert([
            ['nombre' => 'Instagram', ],
            ['nombre' => 'Twitter',],
            ['nombre' => 'Linkedin',],
            ['nombre' => 'Facebook', ],
        ]);
    }
}
