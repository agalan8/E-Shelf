<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tags')->insert([
            ['nombre' => 'Natación', ],
            ['nombre' => 'Deportes',],
            ['nombre' => 'Semana Santa',],
            ['nombre' => 'Religión', ],
            ['nombre' => 'Paisajes', ],
            ['nombre' => 'Urbano', ],
            ['nombre' => 'Cocina', ],
            ['nombre' => 'Monumentos', ],
            ['nombre' => 'Baile', ],
            ['nombre' => 'Carreras', ],
            ['nombre' => 'Caballos', ],
            ['nombre' => 'Cultura', ],
            ['nombre' => 'Fiestas', ],
            ['nombre' => 'Música', ],
            ['nombre' => 'Tradiciones', ],
            ['nombre' => 'Eventos', ],
            ['nombre' => 'Historia', ],
            ['nombre' => 'Arquitectura', ],
            ['nombre' => 'Naturaleza', ],
            ['nombre' => 'Gastronomía', ],
            ['nombre' => 'Arte', ],
            ['nombre' => 'Literatura', ],
        ]);
    }
}
