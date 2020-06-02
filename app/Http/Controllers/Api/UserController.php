<?php
namespace App\Http\Controllers\Api;

use App\User;
use App\Member;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
	public function signin(Request $request)
	{
		$validator = Validator::make(
			$request->all(),
			[
				'email' => 'required|string|email|max:255',
				'password' => 'required|string|min:6',
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

		if ($request->usertype == 'admin' || $request->usertype == 'manager') {
			$credentials = $request->only('email', 'password');

			try {
				if (!$token = JWTAuth::attempt($credentials)) {
					return response()->json(
						[
							'status' => 'error',
							'message'=> 'Invalid credentials.'
						],
						406
					);
				}
			} catch (JWTException $e) {
				return response()->json(
					[
						'status' => 'error',
						'message' => 'Invalid credentials.'
					],
					406
				);
			}

			$user = User::where('email', $request->email)
									->where('active', 1)
									->first();
	
			if (is_null($user)) {
				return response()->json(
					[
						'status' => 'error',
						'message' => 'Your account is inactive now. Please contact to Site manager.'
					],
					406
				);
			}

			return response()->json([
				'status' => 'success',
				'data' => [
					'token' => $token,
					'user' => [
						'member_info' => $user
					]
				]
			], 200);
		} else {
			$user = Member::where('email', $request->email)
										->where('password', md5($request->password))
										->first();

			if (!is_null($user)) {
				return response()->json([
					'status' => 'success',
					'data' => [
						'user' => [
							'member_info' => $user
						]
					]
				], 200);
			} else {
				return response()->json(
					[
						'status' => 'error',
						'message' => 'Invalid credentials.'
					],
					406
				);
			}
		}
	}

	/**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $data = $request->all();
    
    $validUser = Validator::make($data, [
      'username' => 'required|string|max:255',
			'password' => 'required|string|max:255',
			'email' => 'required|string|email|max:255|unique:users'
    ]);

    if ($validUser->fails()) {
      return response()->json(
        [
          'status' => 'fail',
          'data' => $validUser->errors()
        ],
        422
      );
    }

    User::create(array(
			'username' => $data['username'],
			'password' => Hash::make($data['password']),
			'email' => $data['email'],
			'admin' => 0,
			'active' => 0
    ));

    return response()->json([
      'status' => 'success'
    ], 200);
  }
}