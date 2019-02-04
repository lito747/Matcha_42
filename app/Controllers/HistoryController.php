<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/28/18
 * Time: 1:33 PM
 */

namespace App\Controllers;


use App\Models\History;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class HistoryController
 * @package App\Controllers
 */
class HistoryController extends History
{
    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !
     */
    public final function hByUser(Request $request, Response $response, $args){
        $token = htmlspecialchars(addslashes($request->getParam('token')));

        return $response->withStatus(200)
            ->withHeader('Content-Type', "application/json")
            ->write(json_encode(
                $this->allHistory(
                                    $token
                )));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !
     */
    public final function addVisit(Request $request, Response $response, $args){
        $viewer = htmlspecialchars(addslashes($request->getParam('viewerToken')));
        $viewed = htmlspecialchars(addslashes($request->getParam('viewedToken')));

        return $response->withStatus(200)
            ->withHeader('Content-Type', "application/json")
            ->write(json_encode(
                $this->addHistory(
                                    $viewer,
                                    $viewed
                )));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !
     */
    public final function visitors(Request $request, Response $response, $args)
    {
        $token = htmlspecialchars(addslashes($request->getParam('token')));
        return $response->withStatus(200)
            ->withHeader('Content-Type', "application/json")
            ->write(json_encode(
                $this->visitorsHistory(
                    $token
                )));
    }
}