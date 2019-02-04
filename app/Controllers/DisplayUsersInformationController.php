<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/7/18
 * Time: 11:43 AM
 */

namespace App\Controllers;
use \App\Database\DatabaseRequest;
use \App\Models\DisplayUsersInformation;
use Slim\Http\Request;
use Slim\Http\Response;


/**
 * Class DisplayUsersInformationController
 * @package App\Controllers
 */
class DisplayUsersInformationController extends DisplayUsersInformation
{
    /**
     * @param $request
     * @param $response
     * @param $args
     * @return mixed
     */
    public function CheckUserRegistration(Request $request,Response $response, $args){
        $token = htmlspecialchars(addslashes($request->getParam('token')));
        return $response->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($this->checkRegistration($token)));
    }
}
