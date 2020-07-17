<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

use App\Contest;
use App\Participant;

class ParticipantController extends Controller
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

    for ($i = 0; $i < 3; $i++) {
      $data['photo'][$i] = '';

      if (!is_null($data['photoUrl'][$i]) && preg_match('/^data:image\/(\w+);base64,/', $data['photoUrl'][$i])) {
        $pos  = strpos($data['photoUrl'][$i], ';');
        $type = explode(':', substr($data['photoUrl'][$i], 0, $pos))[1];

        if (substr($type, 0, 5) == 'image') {
          $filename = explode('.', $data['filename'][$i])[0] . '_' . date('YmdHis');
  
          $type = str_replace('image/', '.', $type);
  
          $size = (int) (strlen(rtrim($data['photoUrl'][$i], '=')) * 3 / 4);
  
          if ($size < 3200000) {
            $image = substr($data['photoUrl'][$i], strpos($data['photoUrl'][$i], ',') + 1);
            $image = base64_decode($image);
            
            Storage::disk('local')->put($filename . $type, $image);
    
            $data['photo'][$i] = "files/" . $filename . $type;
          } else {
            return response()->json(
              [
                'status' => 'error',
                'message' => 'File size must be less than 3MB.'
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
    }
    
    Participant::create(array(
      'member_id' => $data['member_id'],
      'contest_id' => $data['contest_id'],
      'group_code' => NULL,
      'round_votes' => 0,
      'all_votes' => 0,
      'vote_to' => '',
      'title' => $data['title'],
      'photo_url' => $data['photo'][0],
      'photo_title' => $data['photo_title'],
      'short_desc' => $data['short_desc'],
      'photo_url2' => $data['photo'][1],
      'photo_title2' => $data['photo_title2'],
      'long_desc' => $data['long_desc'],
      'link' => $data['link'],
      'link_desc' => $data['link_desc'],
      'photo_url3' => $data['photo'][2],
      'photo_title3' => $data['photo_title3'],
      'summary' => $data['summary']
    ));

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
  public function update(Request $request)
  {
    $data = $request->all();

    $part = Participant::where('member_id', $data['member_id'])
                      ->where('contest_id', $data['contest_id'])
                      ->get();
    
    $data['photo'][0] = $part[0]->photo_url;
    $data['photo'][1] = $part[0]->photo_url2;
    $data['photo'][2] = $part[0]->photo_url3;

    for ($i = 0; $i < 3; $i++) {
      if (!is_null($data['photoUrl'][$i]) && preg_match('/^data:image\/(\w+);base64,/', $data['photoUrl'][$i])) {
        if ($data['photo'][$i] != 'files/' . $data['filename'][$i]) {
          $pos  = strpos($data['photoUrl'][$i], ';');
          $type = explode(':', substr($data['photoUrl'][$i], 0, $pos))[1];

          if (substr($type, 0, 5) == 'image') {
            $filename = explode('.', $data['filename'][$i])[0] . '_' . date('YmdHis');
    
            $type = str_replace('image/', '.', $type);
    
            $size = (int) (strlen(rtrim($data['photoUrl'][$i], '=')) * 3 / 4);
    
            if ($size < 3200000) {
              $image = substr($data['photoUrl'][$i], strpos($data['photoUrl'][$i], ',') + 1);
              $image = base64_decode($image);
              
              Storage::disk('local')->delete(str_replace('files/', '', $data['photo'][$i]));
              Storage::disk('local')->put($filename . $type, $image);
      
              $data['photo'][$i] = "files/" . $filename . $type;
            } else {
              return response()->json(
                [
                  'status' => 'error',
                  'message' => 'File size must be less than 3MB.'
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
      }
    }

    Participant::where('member_id', $data['member_id'])
              ->where('contest_id', $data['contest_id'])
              ->update(array(
                'title' => $data['title'],
                'photo_url' => $data['photo'][0],
                'photo_title' => $data['photo_title'],
                'short_desc' => $data['short_desc'],
                'photo_url2' => $data['photo'][1],
                'photo_title2' => $data['photo_title2'],
                'long_desc' => $data['long_desc'],
                'link' => $data['link'],
                'link_desc' => $data['link_desc'],
                'photo_url3' => $data['photo'][2],
                'photo_title3' => $data['photo_title3'],
                'summary' => $data['summary']
              ));

    return response()->json([
      'status' => 'success'
    ], 200);
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

  public function contest(Request $request)
  {
    $data = $request->all();

    $contest_id = $data['id'];
    $review = $data['review'];

    $contest = Contest::leftJoin('categories AS sub', 'sub.id', '=', 'contests.category_id')
                      ->leftJoin('categories AS major', 'major.id', '=', 'sub.parent_id')
                      ->leftJoin('users', 'users.id', '=', 'contests.creator_id')
                      ->where('contests.id', $contest_id)
                      ->select('contests.*', 'major.name AS major', 'sub.name AS sub', 'users.username', 'users.email')
                      ->get();

    $participants = Participant::leftJoin('members', 'members.id', '=', 'participants.member_id')
                          ->where('participants.contest_id', $contest_id);

    if ($review == 'active') {

    }

    $participants = $participants->select('members.firstname', 'members.lastname', 'members.gender',
                                    'participants.title', 'participants.round_votes', 'participants.all_votes',
                                    'participants.media1 as media[0]', 'participants.media2 as media[1]',
                                    'participants.media3 as media[2]', 'participants.media4 as media[3]',
                                    'participants.media5 as media[4]', 'participants.media6 as media[5]',
                                    'participants.media7 as media[6]', 'participants.media8 as media[7]',
                                    'participants.media9 as media[8]', 'participants.media10 as media[9]')
                                ->orderBy('participants.all_votes', 'DESC')
                                ->get();

    return response()->json([
      'status' => 'success',
      'contest' => $contest[0],
      'parts' => $participants
    ], 200);
  }
}