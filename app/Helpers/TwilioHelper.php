<?php

namespace App\Helpers;

use Twilio\Rest\Client;
use App\MessageRequest;
use App\UserMeta;

class TwilioHelper
{
    public function send($data)
    {
        $user = auth()->user();
        $package = $user->company->package;

        $sid = env('TWILIO_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $phone_number = env('TWILIO_PHONE_NUMBER');
        $client = new Client($sid, $token);
        $name = $data['name'];
        $mobile = $data['mobile'];

        $message_template = $package->message_template;
        $url = $package->url;

        $message = sprintf('%s %s', str_replace('{name}', $name, $message_template), $url);

        // return true;
        try {
            $client->messages->create(
                // the number you'd like to send the message to
                $mobile,
                array(
                    'from' => $phone_number,
                    'body' => $message
                )
            );

            $data['requester_id'] = $user->id;
            MessageRequest::create($data);
            if (!$user->meta) {
                UserMeta::create([
                    'user_id' => $user->id,
                    'requests_sent' => 1
                ]);
            } else {
                $user->meta->requests_sent++;
                $user->meta->save();
            }
            return true;
        } catch (\Exception $e) {
            return true;
        }
    }
}
