<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('Api')->group(function () {
	Route::post('signin', 'UserController@signin');
	Route::post('forgot', 'ForgotPasswordController@forgot');
	Route::post('reset/{token}', 'ForgotPasswordController@reset');

	Route::get('getConfig', 'AdminController@getConfig');

	Route::get('categories', 'CategoryController@index');
	Route::post('create-category', 'CategoryController@store');

	Route::post('reg-user', 'UserController@store');
	Route::post('reg-member', 'MemberController@store');
	Route::post('reg-participant', 'ParticipantController@store');
	
	Route::group(['middleware' => ['jwt.verify']], function () {
		// Admin Config
		Route::post('setConfig', 'AdminController@setConfig');

		// Category APIs
		Route::put('category/{id}', 'CategoryController@update');
		Route::delete('category/{id}', 'CategoryController@destroy');

		// Contest APIs
		Route::get('contests', 'ContestController@index');
		Route::get('contest/{id}', 'ContestController@show');
		Route::post('create-contest', 'ContestController@store');
		Route::post('open-contests', 'ContestController@open');
	
		// Participant APIs
		Route::post('contest-participants', 'ParticipantController@contest');
	});
});