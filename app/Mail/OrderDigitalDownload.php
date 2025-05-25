<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OrderDigitalDownload extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $order;

    /**
     * Create a new message instance.
     */
    public function __construct($order)
    {
        $this->order = $order;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tus productos digitales',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $downloadLinks = $this->order->lines->map(function ($line) {
            return [
                'title' => $line->titulo ?? 'Producto',
                'url' => $line->path_image,
            ];
        });

        return new Content(
            view: 'emails.order-digital-download',
            with: [
                'order' => $this->order,
                'downloadLinks' => $downloadLinks,
            ],
        );
    }

    /**
     * Build the message and attach files from S3.
     */
    public function build()
    {
        $email = $this->view('emails.order-digital-download')
                      ->with([
                          'order' => $this->order,
                          'downloadLinks' => $this->order->lines->map(function ($line) {
                              return [
                                  'title' => $line->titulo ?? 'Producto',
                                  'url' => $line->path_image,
                              ];
                          }),
                      ]);

        foreach ($this->order->lines as $line) {
            $filePath = $line->path_image;

            // Elimina la parte del dominio para obtener la ruta dentro del bucket
            $storagePath = parse_url($filePath, PHP_URL_PATH);
            $storagePath = ltrim($storagePath, '/'); // elimina la barra inicial



            // Obtener el contenido del archivo desde S3
            if (Storage::disk('s3')->exists($storagePath)) {
                $content = Storage::disk('s3')->get($storagePath);
                $filename = basename($storagePath);

                $extension = Str::afterLast($filename, '.');
                $mimeTypes = [
                    'jpg' => 'image/jpeg',
                    'JPG'=> 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'pdf' => 'application/pdf',
                ];
                $mimeType = $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';

                $email->attachData($content, $filename, [
                    'mime' => $mimeType,
                ]);
            }
        }

        return $email;
    }
}
