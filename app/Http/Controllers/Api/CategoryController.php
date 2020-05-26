<?php

namespace App\Http\Controllers\API;

use App\Category;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $cat = Category::where('parent_id', 0)->get();
    $subcat = Category::where('parent_id', '!=', 0)
                    ->orderBy('parent_id')
                    ->get();

    return response()->json([
      'status' => 'success',
      'major' => $cat,
      'sub' => $subcat,
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
      'name' => 'required|string|max:255'
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
      'short_name' => $short
    ));

    $cat = Category::where('parent_id', 0)->get();
    $subcat = Category::where('parent_id', '!=', 0)
                    ->orderBy('parent_id')
                    ->get();

    return response()->json([
      'status' => 'success',
      'major' => $cat,
      'sub' => $subcat,
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
}