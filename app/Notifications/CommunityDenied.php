<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommunityDenied extends Notification
{
    use Queueable;

    protected $community;
    /**
     * Create a new notification instance.
     */
    public function __construct($community)
    {
        $this->community = $community;
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

            'type' => 'requestDenied',
            'community_id' => $this->community->id,
        ];
    }


}
