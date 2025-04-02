<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Requests\UpdateCategoriaRequest;
use Illuminate\Support\Facades\Redirect;
use App\Models\Categoria;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return Inertia::render('Categorias/Index', [
            'categorias' => Categoria::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoriaRequest $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        Categoria::create([
            'nombre' => $request->nombre,
        ]);

        return Redirect::route('categorias.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Categoria $categoria)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categoria $categoria)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoriaRequest $request, Categoria $categoria)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $categoria->update([
            'nombre' => $request->nombre,
        ]);

        return Redirect::route('categorias.index');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categoria $categoria)
    {
        $categoria->delete();
    }
}
