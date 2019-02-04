<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/22/18
 * Time: 7:51 PM
 */

namespace App\Controllers;


use App\Database\DatabaseRequest;
use App\Models\Notification;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class NotificationController
 * @package App\Controllers
 */
class NotificationController extends Notification
{
    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return
     */
    public final function updateNotification(Request $request, Response $response, $args)
    {
        return $response->withStatus(200)
            ->withHeader('Content-Type', "application/json")
            ->write(json_encode($this->checkNotification($request->getParams())));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return
     */
    public final function addNewNotification(Request $request, Response $response, $args)
    {
        $data = $request->getParams();
        return $response->withHeader('Content-Type', "application/json")
            ->withStatus(200)
            ->write(json_encode($this->addNotification(
                htmlspecialchars(addslashes($data['sourceToken'])),
                htmlspecialchars(addslashes($data['targetToken'])),
                htmlspecialchars(addslashes($data['Type']))
            )));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !
     */
    public final function checkStatus(Request $request, Response $response, $args){
        $token = htmlspecialchars(addslashes($request->getParam('token')));
        if (!($lastOnline = (new DatabaseRequest($this->db))->wildRequest("SELECT data FROM users WHERE token='{$token}'")[0]['data'])) {
            return $response->withHeader('Content-Type', "application/json")
                ->withStatus(200)
                ->write(json_encode(false));
        }
        $diff = (new DatabaseRequest($this->db))->wildRequest("SELECT TIMESTAMPDIFF(SECOND,(SELECT data FROM users WHERE token='{$token}'), (SELECT NOW())) AS diff;")[0]['diff'];
        if ($diff > 10) {
            return $response->withHeader('Content-Type', "application/json")
                ->withStatus(200)
                ->write(json_encode([
                    'status' => false,
                    'date' => $lastOnline
                ]));
        } else {
            return $response->withHeader('Content-Type', "application/json")
                ->withStatus(200)
                ->write(json_encode([
                    'status' => true,
                    'date' => $lastOnline
                    ]));
        }
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return !
     */
    public final function getAllNotif(Request $request, Response $response)
    {
        return $response->withStatus(200)
            ->withHeader('Content-Type', "application/json")
            ->write(json_encode($this->allNotification($request->getParams())));
    }
}