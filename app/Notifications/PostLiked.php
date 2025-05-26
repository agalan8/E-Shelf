<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostLiked extends Notification
{
    use Queueable;

    protected $post;
    protected $liker;

    /**
     * Create a new notification instance.
     */
    public function __construct($post, $liker)
    {
        $this->post = $post;
        $this->liker = $liker;
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

            'type' => 'like',
            'liker_id' => $this->liker->id,
            'liker_name' => $this->liker->name,
            'liker_profile_image' => $this->liker->profileImage?->path_small ?? null,
            'post' => $this->post,

        ];
    }


}
