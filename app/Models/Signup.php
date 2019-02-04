<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/4/18
 * Time: 3:11 PM
 */

namespace App\Models;
use \App\Controllers\Controller;
use App\Database\DatabaseRequest;
use Slim\Http\Request;
use Slim\Http\Response;


/**
 * Class Signup
 * @package App\Models
 */
class Signup extends Controller
{
    protected final function sendMail($email)
    {
        $database = new DatabaseRequest($this->db);
        $user = $database->findData_ASSOC("users", "Email, Login, token", "Email='$email'")[0];
        $token = $user['token'];
        $encoding = "utf-8";
        $mail_to = $user["Email"];
        $mail_subject = "Verify email.";
        $mail_message = "<div style='font-size:10pt; font-style:italic; color:#006699;'>Здравствуйте, ". $user["Login"].",
                Для подтверждения почты нажмите:<br/>

        <a href='http://e3r7p9:3000/valid?token=".$token."'><button style='outline: none;
                        height: 1.7em;
                        width: 10em;
                        font-size: 2vw;
                        border-radius:  0.5vw;
                        color: white;
                        background-color: #08558b;'>Подтвердить</button></a></div>";
        $from_name = "DK";
        $from_mail = "dkunitcorp@gmail.com";
        $header = "Content-type: text/html; charset=".$encoding." \r\n";
        $header .= "From: ".$from_name." <".$from_mail."> \r\n";
        $header .= "MIME-Version: 1.0 \r\n";
        $header .= "Content-Transfer-Encoding: 8bit \r\n";
        $header .= "Date: ".date("r (T)")." \r\n";
        if (mail($mail_to, $mail_subject, $mail_message, $header))
        {
            return (true);
        }
        else{
            return (false);
        }
    }
    /**
     * @param $request
     * @param $response
     * @param $params
     * @param $database
     * @return int
     */
    protected final function checkLogin(Request $request ,Response $response, $params, DatabaseRequest $database){
        $Login = htmlspecialchars(addslashes($params['Login']));
        $data = $database->findData_ASSOC("users", "Login","Login='{$Login}'");
        if(!empty($data)) {
            return (true);
        }
        return (false);
    }

    /**
     * @param $request
     * @param $response
     * @param $params
     * @param $database
     * @return int
     */
    protected final function checkEmail($request , $response, $params,DatabaseRequest $database){
        $Email = htmlspecialchars(addslashes($params['Email']));
        $data = $database->findData_ASSOC("users", "Email","Email='{$Email}'");
        if(!empty($data)) {
            return (true);
        }
        return (false);
    }

    /**
     * @param $response
     * @param $params
     * @param $database
     * @return mixed
     */
    protected final function addNewUser($response , $params,DatabaseRequest $database)
    {
        $password = hash('whirlpool',$params['Password']);
        $Login = htmlspecialchars(addslashes($params['Login']));
        $Email = htmlspecialchars(addslashes($params['Email']));
        $firstName = htmlspecialchars(addslashes($params['FirstName']));
        $lastName = htmlspecialchars(addslashes($params['LastName']));
        $token = hash('whirlpool', "{$Login}{$password}{$Email}");
        return $database->addTableData("users", "Login, Password, Email, token, FirstName, LastName", "'{$Login}', '{$password}', '{$Email}', '{$token}', '{$firstName}', '{$lastName}'");
    }

    /**
     * @param $Email
     * @return int
     */
    protected final function validateEmail($Email){
        if(preg_match('#(.+?)\@([a-z0-9-_]+)\.(aero|arpa|asia|biz|cat|ua|tv|ru|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])#i', $Email)) {
            return (true);
        } else {
            return (false);
        }
    }

    /**
     * @param $Password
     * @return int
     */
    protected final function validatePassword($Password){
        if (preg_match('#^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$#', $Password)) {
            return (true);
        } else {
            return (false);
        }
    }
}