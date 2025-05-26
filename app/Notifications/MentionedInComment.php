<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MentionedInComment extends Notification
{
    use Queueable;

    protected $post;
    protected $mentioner;

    /**
     * Create a new notification instance.
     */
    public function __construct($post, $mentioner)
    {
        $this->post = $post;
        $this->mentioner = $mentioner;
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

            'type' => 'mention',
            'mentioner_id' => $this->mentioner->id,
            'post_id' => $this->post->id,

        ];
    }


}
