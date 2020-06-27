<?php

namespace App\Http\Controllers\API;

use App\Category;
use App\Contest;
use App\Interest;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

use DB;

class CategoryController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $cat = Category::where('parent_id', 0)
                    ->orderBy('name')
                    ->get();
    $subcat = Category::where('parent_id', '!=', 0)
                    ->orderBy('name')
                    ->get();

    $open = Contest::select(DB::raw('count(*) as open, category_id'))
                    ->where('status', 'open')
                    ->groupBy('category_id')
                    ->get();

    $running = Contest::select(DB::raw('count(*) as running, category_id'))
                    ->where('status', 'running')
                    ->groupBy('category_id')
                    ->get();

    return response()->json([
      'status' => 'success',
      'major' => $cat,
      'sub' => $subcat,
      'open' => $open,
      'running' => $running
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
      'parent_id' => 'required',
      'name' => 'required|string|max:255',
      'active' => 'required'
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

    $short = str_replace("--", "", $data['name']);
    $short = str_replace(" ", "-", $short);
    $short = str_replace("--", "-", $short);
    $short = preg_replace('/[^A-Za-z0-9\-]/', '', $short);
    $short = str_replace("--", "-", $short);
    $short = strtolower($short);

    Category::create(array(
      'parent_id' => $data['parent_id'],
      'name' => $data['name'],
      'short_name' => $short,
      'active' => $data['active']
    ));

    $cat = Category::where('parent_id', 0)
                    ->orderBy('name')
                    ->get();
    $subcat = Category::where('parent_id', '!=', 0)
                    ->orderBy('name')
                    ->get();

    $open = Contest::select(DB::raw('count(*) as open, category_id'))
                    ->where('status', 'open')
                    ->groupBy('category_id')
                    ->get();

    $running = Contest::select(DB::raw('count(*) as running, category_id'))
                    ->where('status', 'running')
                    ->groupBy('category_id')
                    ->get();

    return response()->json([
      'status' => 'success',
      'major' => $cat,
      'sub' => $subcat,
      'open' => $open,
      'running' => $running,
      'message' => 'New category "' . $data['name'] . '" is created successfully.'
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
    $data = $request->all();
    
    Category::where('id', $id)
            ->update(array(
              'parent_id' => $data['parent_id'],
              'active' => 1
            ));

    $cat = Category::where('parent_id', 0)
            ->orderBy('name')
            ->get();
    $subcat = Category::where('parent_id', '!=', 0)
            ->orderBy('name')
            ->get();

    $open = Contest::select(DB::raw('count(*) as open, category_id'))
                    ->where('status', 'open')
                    ->groupBy('category_id')
                    ->get();

    $running = Contest::select(DB::raw('count(*) as running, category_id'))
                    ->where('status', 'running')
                    ->groupBy('category_id')
                    ->get();

    return response()->json([
      'status' => 'success',
      'major' => $cat,
      'sub' => $subcat,
      'open' => $open,
      'running' => $running
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
    Category::where('id', $id)->delete();

    $cat = Category::where('parent_id', 0)
                    ->orderBy('name')
                    ->get();
    $subcat = Category::where('parent_id', '!=', 0)
                    ->orderBy('name')
                    ->get();

    $open = Contest::select(DB::raw('count(*) as open, category_id'))
                    ->where('status', 'open')
                    ->groupBy('category_id')
                    ->get();

    $running = Contest::select(DB::raw('count(*) as running, category_id'))
                    ->where('status', 'running')
                    ->groupBy('category_id')
                    ->get();

    return response()->json([
      'status' => 'success',
      'major' => $cat,
      'sub' => $subcat,
      'open' => $open,
      'running' => $running
    ], 200);
  }

  public function interests(Request $request)
  {
    $data = $request->all();

    $member_id = $data['member_id'];

    $interests = Interest::where('member_id', $member_id)->get();

    $major = array();
    $sub = array();

    if (sizeof($interests) > 0) {
      $ids = explode(',', $interests[0]->major_ids);

      $major = Category::whereIn('id', $ids)->orderBy('name')->get();

      $sub = Category::whereIn('parent_id', $ids)->orderBy('name')->get();
    }

    return response()->json([
      'status' => 'success',
      'major' => $major,
      'sub' => $sub
    ], 200);
  }

  public function addInterest(Request $request)
  {
    $data = $request->all();

    $category_id = $data['category_id'];
    $member_id = $data['member_id'];

    $interests = Interest::where('member_id', $member_id)->get();

    if (sizeof($interests) > 0) {
      Interest::where('member_id', $member_id)
              ->update(array(
                'major_ids' => $interests[0]->major_ids . ',' . $category_id
              ));
    } else {
      Interest::create(array(
        'member_id' => $member_id,
        'major_ids' => $category_id
      ));
    }

    $interests = Interest::where('member_id', $member_id)->get();

    $major = array();
    $sub = array();

    $ids = explode(',', $interests[0]->major_ids);

    $major = Category::whereIn('id', $ids)->orderBy('name')->get();

    $sub = Category::whereIn('parent_id', $ids)->orderBy('name')->get();

    return response()->json([
      'status' => 'success',
      'major' => $major,
      'sub' => $sub
    ], 200);
  }

  public function removeInterest(Request $request)
  {
    $data = $request->all();

    $category_id = $data['category_id'];
    $member_id = $data['member_id'];

    $interests = Interest::where('member_id', $member_id)->get();

    $idArr = explode(',', $interests[0]->major_ids);

    $major = array();
    $sub = array();

    if (sizeof($idArr) == 1) {
      Interest::where('member_id', $member_id)->delete();
    } else {
      $ids = '';
      for ($i = 0; $i < sizeof($idArr); $i++) {
        if ($idArr[$i] != $category_id) {
          $ids .= $idArr[$i] . ',';
        }
      }

      $ids = substr($ids, 0, strlen($ids) - 1);
      
      Interest::where('member_id', $member_id)
              ->update(array(
                'major_ids' => $ids
              ));

      $ids = explode(',', $ids);

      $major = Category::whereIn('id', $ids)->orderBy('name')->get();

      $sub = Category::whereIn('parent_id', $ids)->orderBy('name')->get();
    }

    return response()->json([
      'status' => 'success',
      'major' => $major,
      'sub' => $sub
    ], 200);
  }
}