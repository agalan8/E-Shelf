<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderLineRequest;
use App\Http\Requests\UpdateOrderLineRequest;
use App\Models\OrderLine;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OrderLineController extends Controller
{

public function downloadImage($orderLineId)
{
    $orderLine = OrderLine::with('order')->findOrFail($orderLineId);

    if ($orderLine->order->user_id !== Auth::id()) {
        abort(403, 'Acceso no autorizado.');
    }

    $fullUrl = $orderLine->path_image;

    // Extraer ruta relativa del URL completo
    $parsedUrl = parse_url($fullUrl);
    if (!isset($parsedUrl['path'])) {
        abort(404, 'Ruta de imagen inválida.');
    }
    $relativePath = ltrim($parsedUrl['path'], '/'); // elimina la barra inicial

    if (!Storage::disk('s3')->exists($relativePath)) {
        abort(404, 'Imagen no encontrada en S3.');
    }

    $fileContents = Storage::disk('s3')->get($relativePath);
    $mimeType = Storage::disk('s3')->mimeType($relativePath);
    $fileName = basename($relativePath);

    return response($fileContents, 200, [
        'Content-Type' => $mimeType,
        'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
    ]);
}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreOrderLineRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderLine $orderLine)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrderLine $orderLine)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderLineRequest $request, OrderLine $orderLine)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderLine $orderLine)
    {
        //
    }
}
