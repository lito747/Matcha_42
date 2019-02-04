<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/4/18
 * Time: 11:44 AM
 */

namespace App\Models;
use \App\Controllers\Controller;
use \App\Database\DatabaseRequest;


/**
 * Class Login
 * @package App\Models
 */
class Signin extends Controller
{
    private $data;
    private $password;

    /**
     * @param $Login
     * @param $Password
     * @param $db
     * @return bool
     */
    protected final function setUserOnline($Login, $Password, $db){

        $database = new DatabaseRequest($db);
        $database->UseDB("db_matcha");
        $Login = htmlspecialchars(addslashes($Login));
        $this->password = $database->findData_ASSOC('users', "Password", "Login='{$Login}'");
        if (hash("whirlpool", $Password) == $this->password[0]['Password'])
        {
            unset($this->password);
            $this->data = $this->getToken($Login, $database);
            $this->data['FullRegister'] = intval($this->data['FullRegister']);
            $this->data['EmailConfirm'] = intval($this->data['EmailConfirm']);
            return $this->data;
        } else {
            return false;
        }
    }

    /**
     * @param $token
     * @return array
     */
    protected final function isUserLogged($token)
    {
        $user = (new DatabaseRequest($this->db))->findData_ASSOC("users", "token, FullRegister", "token='{$token}'");
        if ($user)
        {
            return [
                'token' => $user[0]['token'],
                'is_reg' => $user[0]['FullRegister'],
            ];
        }
        else
        {
            return [
                'token' => false,
                'is_reg' => false,
            ];
        }
    }

    /**
     * @param $Login
     * @param $database
     */
    private final function getToken($Login,DatabaseRequest $database){
        $Login = htmlspecialchars(addslashes($Login));
        $data = $database->findData_ASSOC('users', "token, FullRegister, EmailConfirm", "Login='{$Login}'");
        return $data[0];
    }
}