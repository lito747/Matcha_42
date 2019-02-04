<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/2/18
 * Time: 11:46 AM
 */

use \App\Controllers\UserController;
use \App\Controllers\SigninController;
use \App\Controllers\SignupController;
use \App\Controllers\DisplayUsersInformationController;
use App\Controllers\DisplayProfileInformationController;
use App\Controllers\RecoverController;
use App\Controllers\UserListController;
use \App\Controllers\NotificationController;
use  \App\Controllers\BlackListController;
use App\Controllers\LikesController;
use App\Controllers\ChatController;
use App\Controllers\PopularityController;
use App\Controllers\ReportController;
use App\Controllers\HistoryController;

$app->group('/signin', function (){
    $this->post('', SigninController::class.":loginUser");
    $this->post('/password/recover', RecoverController::class.":recover");
    $this->post('/password/new', RecoverController::class.":newPassword");
    $this->post('/user/logged', SigninController::class.":isLogged");
});


$app->group('/signup', function () {
    $this->post('', SignupController::class.":registration");
    $this->post('/verify', SignupController::class.":verifyEmail");
});

$app->group('/profile', function ()
{
    $this->post("/create", DisplayProfileInformationController::class.":finishUserRegister");
});

$app->group('/chat', function(){
    $this->post('/rooms/create', ChatController::class.":createRoom");
    $this->post('/rooms/get', ChatController::class.":getRoom");
    $this->post('/message/send', ChatController::class.":sendMessage");
    $this->post('/message/get', ChatController::class.":getMessage");
    $this->post('/message/history', ChatController::class.":messageHistory");
});

$app->group('/users', function (){
    $this->post('/checkUReg', DisplayUsersInformationController::class.":CheckUserRegistration");
    $this->post('/all', UserListController::class.":getAllUsers");
    $this->post('/sorted', UserListController::class.":getSortedUsers");
    $this->post('/generate', UserController::class.":generate");
    $this->post('/update/{token}', UserController::class.":updateUser");
    $this->post('/{token}', UserListController::class.":getCurrentUser");
});

$app->group('/notification', function (){
    $this->post('/check', NotificationController::class.":updateNotification");
    $this->post('/add', NotificationController::class.":addNewNotification");
    $this->post('/online', NotificationController::class.":checkStatus");
    $this->post('/all', NotificationController::class.":getAllNotif");
});

$app->group('/blacklist', function (){
    $this->post('/add', BlackListController::class.":addUser");
    $this->post('/remove', BlackListController::class.":removeUser");
    $this->post('/review', BlackListController::class.":reviewList");
    $this->post('/is_blocked', BlackListController::class.":checkUser");
});

$app->group('/like', function ()
{
    $this->post('/add', LikesController::class.":addLike");
    $this->post('/remove', LikesController::class.":removeLike");
    $this->post('/check', LikesController::class.":checkLikes");
    $this->post('/is_liked', LikesController::class.":isLiked");
    $this->post('/likedBy', LikesController::class.":likesHistory");
});

$app->group('/popularity', function (){
    $this->post('/add', PopularityController::class.":addPopularity");
});

$app->group('/report', function (){
    $this->post('/fake', ReportController::class.":rFake");
});


$app->group('/history', function (){
    $this->post('/ofVisits', HistoryController::class.":hByUser");
    $this->post('/addVisits', HistoryController::class.":addVisit");
    $this->post('/visitors', HistoryController::class.":visitors");
});