<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/2/18
 * Time: 1:24 PM
 */

namespace App\Controllers;
use PDO;
use App\Models\User;
use App\Database\DatabaseRequest;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class UserController
 * @package App\Controllers
 */
class UserController extends User
{
    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return Response
     */
    public function generate(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($this->userGenerator($request->getParams())));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     */
    public function updateUser(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($this->update(
                htmlspecialchars(addslashes($args['token'])),
                $request->getParams()
            )));
    }
}