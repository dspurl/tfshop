<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return view('welcome');
});
Route::get('/home', function () {
    return view('home');
});
Route::namespace('v1')->group(function () {
    Route::post('echo', 'EchoController@index')-> name('echo');  //智能音箱设备管理
    Route::get('echo', 'EchoController@index')-> name('echo');
});
Auth::routes();
