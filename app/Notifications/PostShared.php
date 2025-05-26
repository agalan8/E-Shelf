<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostShared extends Notification
{
    use Queueable;

    protected $post;
    protected $sharer;

    /**
     * Create a new notification instance.
     */
    public function __construct($post, $sharer)
    {
        $this->post = $post;
        $this->sharer = $sharer;
    }


    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable)
    {
        return [

            'type' => 'share',
            'sharer_id' => $this->sharer->id,
            'post_id' => $this->post->id,

        ];
    }


}
