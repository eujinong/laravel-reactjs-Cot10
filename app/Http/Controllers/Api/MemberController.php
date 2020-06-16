<?php

namespace App\Http\Controllers\API;

use App\Member;
use App\Interest;

use JWTAuth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class MemberController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id)
  {
    
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
    
    $validMember = Validator::make($data, [
      'firstname' => 'required|string|max:255',
      'lastname' => 'required|string|max:255',
      'password' => 'required|string|max:255',
      'gender' => 'required|integer',
      'number' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:members',
      'country' => 'required|string|max:255',
      'state' => 'required|string|max:255',
      'county' => 'required|string|max:255',
      'city' => 'required|string|max:255',
      'zip_code' => 'required|string|max:255',
      'street' => 'required|string|max:255',
    ]);

    if ($validMember->fails()) {
      return response()->json(
        [
          'status' => 'fail',
          'data' => $validMember->errors()
        ],
        422
      );
    }

    $data['profile_image'] = "";
    
    $base64_image = $request->input('profile_image');
                  
    if ($base64_image != '' && preg_match('/^data:image\/(\w+);base64,/', $base64_image)) {
      $pos  = strpos($base64_image, ';');
      $type = explode(':', substr($base64_image, 0, $pos))[1];

      if (substr($type, 0, 5) == 'image') {
        $filename = $data['firstname'] . '_' . $data['birthday'];

        $type = str_replace('image/', '.', $type);

        $size = (int) (strlen(rtrim($base64_image, '=')) * 3 / 4);

        if ($size < 2100000) {
          $image = substr($base64_image, strpos($base64_image, ',') + 1);
          $image = base64_decode($image);
          
          Storage::disk('local')->put($filename . $type, $image);
  
          $data['profile_image'] = "files/" . $filename . $type;
        } else {
          return response()->json(
            [
              'status' => 'error',
              'message' => 'File size must be less than 2MB.'
            ],
            406
          );
        }
      } else {
        return response()->json(
          [
            'status' => 'error',
            'message' => 'File type is not image.'
          ],
          406
        );
      }
    }

    $member = Member::create(array(
      'firstname' => $data['firstname'],
      'lastname' => $data['lastname'],
      'password' => md5($data['password']),
      'profile_image' => $data['profile_image'],
      'gender' => $data['gender'],
      'number' => $data['number'],
      'email' => $data['email'],
      'country' => $data['country'],
      'state' => $data['state'],
      'county' => $data['county'],
      'city' => $data['city'],
      'zip_code' => $data['zip_code'],
      'street' => $data['street'],
      'building' => $data['building'],
      'apartment' => $data['apartment']
    ));

    if (array_key_exists('major_ids', $data)) {
      $major_ids = '';

      foreach ($data['major_ids'] as $id) {
        $major_ids .= $id . ',';
      }

      Interest::create(array(
        'member_id' => $member->id,
        'major_ids' => substr($major_ids, 0, strlen($major_ids) - 1)
      ));
    }

    return response()->json([
      'status' => 'success'
    ], 200);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $id)
  {
    
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id)
  {
    
  }

  public function invite_accept(Request $request)
  {

  }
}