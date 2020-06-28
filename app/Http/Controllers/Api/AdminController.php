<?php

namespace App\Http\Controllers\API;

use App\Option;
use App\Contest;
use App\Participant;

use DB;

use JWTAuth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
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

  public function contests()
  {
    $participants = Participant::leftJoin('contests', 'contests.id', '=', 'participants.contest_id')
                      ->select(DB::raw('COUNT(participants.id) as parts'), 'participants.contest_id')
                      ->groupBy('participants.contest_id')
                      ->get();
    
    $contests = Contest::leftJoin('categories AS sub', 'sub.id', '=', 'contests.category_id')
                      ->leftJoin('categories AS major', 'major.id', '=', 'sub.parent_id')
                      ->where('status', '!=', 'close')
                      ->select('contests.*', 'sub.parent_id', 'major.name AS major', 'sub.name AS sub')
                      ->orderBy('contests.start_date')
                      ->get();

    return response()->json([
      'status' => 'success',
      'participants' => $participants,
      'contests' => $contests
    ], 200);
  }

  public function getConfig()
  {
    $options = Option::get();

    return response()->json([
      'status' => 'success',
      'options' => $options
    ], 200);
  }

  public function setConfig(Request $request)
  {
    $data = $request->all();

    foreach ($data as $key => $value) {
      $exist = Option::where('option', $key)->get();

      if (sizeof($exist) > 0) {
        Option::where('option', $key)->update(array(
          'value' => $value
        ));
      } else {
        Option::create(array(
          'option' => $key,
          'value' => $value
        ));
      }
    }

    return response()->json([
      'status' => 'success'
    ], 200);
  }
}