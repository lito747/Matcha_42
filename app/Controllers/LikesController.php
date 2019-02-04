<?php
/**
 * Created by PhpStorm.
 * User: Дмитрий
 * Date: 24.10.2018
 * Time: 18:44
 */

namespace App\Controllers;


use App\Models\Likes;
use Slim\Http\Request;
use Slim\Http\Response;

class LikesController extends Likes
{
    public final function addLike(Request $request, Response $response, $argc){
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->like(
                htmlspecialchars(addslashes($request->getParam('sourceToken'))),
                htmlspecialchars(addslashes($request->getParam('targetToken')))
            )));
    }

    public final function removeLike(Request $request, Response $response, $argc){
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->unlike(
                htmlspecialchars(addslashes($request->getParam('sourceToken'))),
                htmlspecialchars(addslashes($request->getParam('targetToken')))
            )));
    }

    public final function checkLikes(Request $request, Response $response, $argc){
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->reviewLikes(
                htmlspecialchars(addslashes($request->getParam('sourceToken')))
                )));
    }

    public final function isLiked(Request $request, Response $response, $argc){
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->checkIfLiked(
                htmlspecialchars(addslashes($request->getParam('sourceToken'))),
                htmlspecialchars(addslashes($request->getParam('targetToken')))
                )));
    }

    public final function likesHistory(Request $request, Response $response, $argc)
    {
        return $response->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->likedBy(
                htmlspecialchars(addslashes($request->getParam('token')))
            )));
    }
}