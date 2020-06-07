<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
    
    $files = $data['files'];
    $uploads = $data['uploads'];
    $urls = $data['urls'];

    $media = array();

    for ($i = 0; $i < 10; $i++) {
      $media[$i] = '';

      if ($uploads[$i] != '' && !is_null($uploads[$i])) {
        $filename = $files[$i];

        $file_path = Storage::disk('local')->path('');
        $file_name = explode('.', $filename)[0];
        $file_ext = explode('.', $filename)[1];

        if (count(glob($file_path . "$file_name*.$file_ext")) > 0) {
          $filename = $file_name . '_' . count(glob($file_path . "$file_name*.$file_ext")) . '.' . $file_ext;
        }
        
        $file = substr($uploads[$i], strpos($uploads[$i], ',') + 1);
        $file = base64_decode($file);
        
        Storage::disk('local')->put($filename, $file);

        $media[$i] = "files/" . $filename;
      }

      if ($urls[$i] != '' && !is_null($urls[$i])) {
        $media[$i] = $urls[$i];
      }
    }
    
    Participant::create(array(
      'member_id' => $data['member_id'],
      'contest_id' => $data['contest_id'],
      'group_code' => NULL,
      'round_votes' => 0,
      'all_votes' => 0,
      'vote_to' => '',
      'media1' => $media[0],
      'media2' => $media[1],
      'media3' => $media[2],
      'media4' => $media[3],
      'media5' => $media[4],
      'media6' => $media[5],
      'media7' => $media[6],
      'media8' => $media[7],
      'media9' => $media[8],
      'media10' => $media[9]
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

  public function contest(Request $request)
  {
    $data = $request->all();
  }
}