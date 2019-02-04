<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/4/18
 * Time: 12:28 PM
 */

namespace App\Controllers;
use \App\Database\DatabaseRequest;
use \App\Models\Signup;
use PDO;
use Slim\Http\Request;
use Slim\Http\Response;

/**
 * Class SignupController
 * @package App\Controllers
 */
class SignupController extends Signup
{
    /**
     * @param $request
     * @param $response
     * @param $args
     * @return mixed
     */
    public function registration(Request $request,Response $response, $args){
        $params = $request->getParams();
        $database = new DatabaseRequest($this->db);
        $database->UseDB("db_matcha");
        $data = [
            'ValidEmail' => false,
            'ValidPassword' => false,
            'PasswordMatch' => false,
            'Email' => $params['Email'],
            'Login' => $params['Login'],
            'EmailExist' => false,
            'LoginExist' => false,
            'UserCreated' =>false,
            'request' => $params
        ];
        $data['LoginExist'] = $this->checkLogin($request, $response, $params, $database);
        $data['ValidEmail'] = $this->validateEmail($params['Email']);
        if ($data['ValidEmail'])
        {
            $data['EmailExist'] = $this->checkEmail($request, $response, $params, $database);
        }
        if ($params['Password'] == $params["ConfirmedPassword"]) {
            $data['PasswordMatch'] = true;
            $data['ValidPassword'] = $this->validatePassword($params['Password']);
            if ($data['ValidPassword']) {
                if (!$data['LoginExist'] && !$data['EmailExist'] && $data['ValidEmail']) {
                    $data['UserCreated'] = boolval($this->addNewUser($response, $params, $database));
                    if ($data['UserCreated']) {
                        $data['EmailVerifyRequest'] = $this->sendMail($params['Email']);
                    }
                }
            }
        } else {
            $data['PasswordMatch'] = false;
        }
        return $response->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($data));
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return !
     */
    public function verifyEmail(Request $request, Response $response, $args)
    {
        $token = htmlspecialchars(addslashes($request->getParam('token')));
        if ((new DatabaseRequest($this->db))->findData_ASSOC('users','*',"token='{$token}'")[0])
        {
            (new DatabaseRequest($this->db))->updateTableData("users", "EmailConfirm=1", "token='{$token}'");
            return $response->withStatus(200)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(
                    ['EmailVerified' => true]
                ));
        }
        else {
            return $response->withStatus(200)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(
                    ['EmailVerified' => false]
                ));
        }
    }
}