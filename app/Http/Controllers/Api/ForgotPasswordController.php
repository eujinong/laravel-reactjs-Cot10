<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\PasswordReset;
use App\User;
use App\Notifications\ResetPasswordNotification;
use JWTAuth;

class ForgotPasswordController extends Controller
{

    public function forgot(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => 'required|exists:users,email'
            ]
        );

        if ($validator->fails()) {
            return response()->json(
                [
                    'status' => 'fail',
                    'data' => $validator->errors(),
                ],
                422
            );
        }


        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        PasswordReset::destroy($email);

        $token = md5(time() . $email);
        $passwordReset = PasswordReset::create([
            'email' => $email,
            'token' => $token
        ]);

        if ($passwordReset) {
            $user->notify(new ResetPasswordNotification($user, $token));
            return response()->json([
                'status' => 'success',
                'message' => 'A confirmation link was sent to the email above for verification.',
                'data' => []
            ], 200);
        }

        return response()->json([
            'status' => 'fail',
            'message' => 'Unable to process your requests',
            'data' => []
        ], 406);
    }

    public function reset(Request $request, $token)
    {
        $passwordReset = PasswordReset::where('token', $token)->first();

        if ($passwordReset === null || $passwordReset->isExpired() || !$passwordReset->user === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'Your token is not valid.'
            ], 406);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'password' => 'required|string|min:6|confirmed',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'data' => $validator->errors(),
            ], 422);
        }

        $user = $passwordReset->user;
        $user->update([
            'password' => Hash::make($request->get('password')),
        ]);
        $passwordReset->delete();

        $token = JWTAuth::fromUser($user);
        return response()->json(
            [
                'status' => 'success',
                'data' => [
                    'token' => $token,
                    'user' => $user
                ]
            ],
            200
        );
    }
}
