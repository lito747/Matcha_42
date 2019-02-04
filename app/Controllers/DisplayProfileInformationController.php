<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/16/18
 * Time: 12:44 PM
 */

namespace App\Controllers;
use App\Database\DatabaseRequest;
use App\Models\DisplayUsersInformation;
use Slim\Http\Request;
use Slim\Http\Response;


/**
 * Class DisplayProfileInformationController
 * @package App\Controllers
 */
class DisplayProfileInformationController extends DisplayUsersInformation
{
    /**
     * @param $request
     * @param $response
     * @param $args
     * @return mixed
     */
    public function finishUserRegister(Request $request, Response $response, $args){
        $data = $request->getParams();
        if (isset($data['Token']) && !empty($data['Token'])) {
            return $response->withStatus(200)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode($this->checkExtendDate(
                    $data,
                    htmlspecialchars(addslashes($data['Token']))
                )));
        }
        return $response->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode("empty_token"));
    }
}