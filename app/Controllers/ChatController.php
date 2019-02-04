<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/27/18
 * Time: 3:33 PM
 */

namespace App\Controllers;


use App\Models\Chat;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class ChatController
 * @package App\Controllers
 */
class ChatController extends Chat
{
    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !array
     */
    public final function sendMessage(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->onSend(
                htmlspecialchars(addslashes($request->getParam('token'))),
                htmlspecialchars(addslashes($request->getParam('room'))),
                htmlspecialchars(addslashes($request->getParam('msg')))
            )));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !array
     */
    public final function getMessage(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->onGetMessage(
                htmlspecialchars(addslashes($request->getParam('token'))),
                htmlspecialchars(addslashes($request->getParam('room')))
            )));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !array
     */
    public final function messageHistory(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->history(
                htmlspecialchars(addslashes($request->getParam('token'))),
                htmlspecialchars(addslashes($request->getParam('room')))
            )));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !array
     */
    public final function getRoom(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->findRoom(
                htmlspecialchars(addslashes($request->getParam('token1'))),
                htmlspecialchars(addslashes($request->getParam('token2')))
            )));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !array
     */
    public final function createRoom(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->newRoom(
                htmlspecialchars(addslashes($request->getParam('token1'))),
                htmlspecialchars(addslashes($request->getParam('token2')))
            )));
    }
}