@extends('layouts.master')

@section('sidebar')
    @parent
    <p>This is appended to the master sidebar.</p>
@stop

@section('content')
    <p>@upper('This is my body content.')</p>
@stop
