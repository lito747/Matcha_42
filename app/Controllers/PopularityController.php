<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/27/18
 * Time: 7:03 PM
 */

namespace App\Controllers;


use App\Models\Popularity;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class PopularityController
 * @package App\Controllers
 */
class PopularityController extends Popularity
{
    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !array
     */
    public final function addPopularity(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader('Content-Type','application/json')
            ->write(json_encode($this->increase(
                htmlspecialchars(addslashes($request->getParam('token')))
                )));
    }
}