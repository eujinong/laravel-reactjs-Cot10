<?php

namespace App\Http\Controllers\API;

use App\Contest;
use App\Participant;
use App\Category;
use App\Interest;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

use DB;

class ContestController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $user = JWTAuth::parseToken()->authenticate();
    
    $contests = Contest::leftJoin('categories AS sub', 'sub.id', '=', 'contests.category_id')
                      ->leftJoin('categories AS major', 'major.id', '=', 'sub.parent_id')
                      ->where('creator_id', $user->id)
                      ->where('status', '!=', 'close')
                      ->select('contests.*', 'sub.parent_id', 'major.name AS major', 'sub.name AS sub')
                      ->orderBy('contests.start_date')
                      ->get();

    return response()->json([
      'status' => 'success',
      'contests' => $contests
    ], 200);
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id)
  {
    $members = Participant::leftJoin('members', 'members.id', '=', 'participants.member_id')
                ->where('contest_id', $id)
                ->whereNull('group_code')
                ->select('members.*', 
                        'participants.media1 as media[0]', 'participants.media2 as media[1]',
                        'participants.media3 as media[2]', 'participants.media4 as media[3]',
                        'participants.media5 as media[4]', 'participants.media6 as media[5]',
                        'participants.media7 as media[6]', 'participants.media8 as media[7]',
                        'participants.media9 as media[8]', 'participants.media10 as media[9]')
                ->get();

    for ($i = 0; $i < sizeof($members); $i++) {
      $members[$i]->files = 0;
      $members[$i]->urls = 0;

      for ($j = 0; $j < 10; $j++) {
        if ($members[$i]['media[' . $j . ']'] != '') {
          if (substr($members[$i]['media[' . $j . ']'], 0, 5) == 'files') {
            $members[$i]->files++;
          } else {
            $members[$i]->urls++;
          }
        }
      }
    }

    return response()->json(array(
      'members' => $members
    ));
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
    
    $valid = Validator::make($data, [
      'category_id' => 'required',
      'creator_id' => 'required',
      'name' => 'required|string|max:255',
      'round_days' => 'required|integer',
      'allow_video' => 'required|bool',
      'start_date' => 'required|string|max:255',
      'gole' => 'required|string|max:500',
      'rule' => 'required|string|max:500',
      'ending' => 'required|string|max:500'
    ]);

    if ($valid->fails()) {
      return response()->json(
        [
          'status' => 'fail',
          'data' => $valid->errors()
        ],
        422
      );
    }

    $url = str_replace("--", "", $data['name']);
    $url = str_replace(" ", "-", $url);
    $url = str_replace("--", "-", $url);
    $url = preg_replace('/[^A-Za-z0-9\-]/', '', $url);
    $url = str_replace("--", "-", $url);
    $url = strtolower($url);

    Contest::create(array(
      'category_id' => $data['category_id'],
      'creator_id' => $data['creator_id'],
      'name' => $data['name'],
      'url' => $url,
      'round_days' => $data['round_days'],
      'allow_video' => $data['allow_video'],
      'start_date' => $data['start_date'],
      'end_date' => null,
      'gole' => $data['gole'],
      'rule' => $data['rule'],
      'ending' => $data['ending'],
      'note' => $data['note'],
      'status' => 'open'
    ));

    $contests = Contest::leftJoin('categories AS sub', 'sub.id', '=', 'contests.category_id')
                      ->leftJoin('categories AS major', 'major.id', '=', 'sub.parent_id')
                      ->where('creator_id', $data['creator_id'])
                      ->where('status', '!=', 'close')
                      ->select('contests.*', 'sub.parent_id', 'major.name AS major', 'sub.name AS sub')
                      ->orderBy('contests.start_date')
                      ->get();

    $gole = Contest::select(DB::raw('DISTINCT(gole) as gole'))
                  ->orderBy('gole')->get();

    $rule = Contest::select(DB::raw('DISTINCT(rule) as rule'))
                  ->orderBy('rule')->get();

    $ending = Contest::select(DB::raw('DISTINCT(ending) as ending'))
                  ->orderBy('ending')->get();

    $note = Contest::whereNotNull('note')->select(DB::raw('DISTINCT(note) as note'))
                  ->orderBy('note')->get();

    return response()->json([
      'status' => 'success',
      'message' => 'The contest "' . $data['name'] . '" is created successfully.',
      'contests' => $contests,
      'gole' => $gole,
      'rule' => $rule,
      'ending' => $ending,
      'note' => $note
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

  public function open(Request $request)
  {
    $data = $request->all();
  }

  public function text()
  {
    $gole = Contest::select(DB::raw('DISTINCT(gole) as gole'))
                  ->orderBy('gole')->get();

    $rule = Contest::select(DB::raw('DISTINCT(rule) as rule'))
                  ->orderBy('rule')->get();

    $ending = Contest::select(DB::raw('DISTINCT(ending) as ending'))
                  ->orderBy('ending')->get();

    $note = Contest::whereNotNull('note')->select(DB::raw('DISTINCT(note) as note'))
                  ->orderBy('note')->get();

    return response()->json([
      'status' => 'success',
      'gole' => $gole,
      'rule' => $rule,
      'ending' => $ending,
      'note' => $note
    ], 200);
  }

  public function getcontests(Request $request)
  {
    $data = $request->all();

    $member_id = $data['member_id'];

    $interests = Interest::where('member_id', $member_id)->get();

    $contests = array();

    if ($interests[0]->major_ids != '') {
      $sub = array();

      $ids = explode(',', $interests[0]->major_ids);

      $cats = Category::whereIn('parent_id', $ids)->get();

      foreach ($cats as $cat) {
        array_push($sub, $cat->id);
      }

      $contests = Contest::whereIn('category_id', $sub)
                        ->where('status', 'open')
                        ->orderBy('start_date')
                        ->get();
    }

    return response()->json([
      'status' => 'success',
      'contests' => $contests
    ], 200);
  }
}