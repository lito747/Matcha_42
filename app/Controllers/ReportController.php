<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/28/18
 * Time: 1:32 PM
 */

namespace App\Controllers;


use App\Models\Report;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class ReportController
 * @package App\Controllers
 */
class ReportController extends Report
{
    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !
     */
    public final function rFake(Request $request, Response $response, $args){
        $reporter = htmlspecialchars(addslashes($request->getParam('reporterToken')));
        $reported = htmlspecialchars(addslashes($request->getParam('reportedToken')));

        return $response->withStatus(200)
            ->withHeader('Content-Type', "application/json")
            ->write(json_encode(
                $this->addFake(
                    $reporter,
                    $reported
                )));
    }
}