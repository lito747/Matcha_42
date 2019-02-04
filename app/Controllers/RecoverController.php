<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 9/20/18
 * Time: 8:07 PM
 */

namespace App\Controllers;

use App\Database\DatabaseRequest;
use App\Models\Recover;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class RecoverController
 * @package App\Controllers
 */
class RecoverController extends Recover
{
    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !
     */
    public function recover(Request $request, Response $response, $args){
        $res = [
            "userExist" => false,
            "mailSend" => false,
        ];
        $to_find = htmlspecialchars(addslashes($request->getParam('find')));
        if (($res['userExist'] = $this->isUserExist($to_find)))
        {
            $res['mailSend'] = $this->sendRecMail($to_find);
        }
        return $response->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($res));
    }

    /**
     * @param $Password
     * @return bool
     */
    private final function validatePassword($Password){
        if (preg_match('#^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$#', $Password)) {
            return (true);
        } else {
            return (false);
        }
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !
     */
    public function newPassword(Request $request, Response $response, $args){
        $token = htmlspecialchars(addslashes($request->getParam('token')));
        $password = htmlspecialchars(addslashes($request->getParam('Password')));
        $res = [
            'user' => false,
            'updated' => false,
            'pass_match' => false,
            'Pass1' => $password,
            'Pass2' => $request->getParam('repeatPassword'),
            'userr' => $token
        ];
        if ((new DatabaseRequest($this->db))->findData_ASSOC('users', 'token', "token='{$token}'")) {
            $res['user'] = true;
            if ($password == htmlspecialchars(addslashes($request->getParam('repeatPassword')))){
                $res['pass_match'] = true;
                if ($this->validatePassword($password)) {
                    (new DatabaseRequest($this->db))->updateTableData("users", "Password='" . hash("whirlpool", $password) ."'", "token='{$token}'");
                    $res['updated'] = true;
                }
            }
        }
        return $response->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($res));
    }
}