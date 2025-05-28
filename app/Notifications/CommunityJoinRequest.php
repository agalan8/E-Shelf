<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommunityJoinRequest extends Notification
{
    use Queueable;

    protected $community;
    protected $requester;

    /**
     * Create a new notification instance.
     */
    public function __construct($community, $requester)
    {
        $this->community = $community;
        $this->requester = $requester;
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

            'type' => 'request',
            'requester_id' => $this->requester->id,
            'community_id' => $this->community->id,
        ];
    }


}
