<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 9/20/18
 * Time: 8:10 PM
 */

namespace App\Models;


use App\Controllers\Controller;
use App\Database\DatabaseRequest;

/**
 * Class Recover
 * @package App\Models
 */
class Recover extends Controller
{
    /**
     * @param $to_find
     * @param $user_data
     * @return bool
     */
    protected final function isUserExist($to_find){
        $database = new DatabaseRequest($this->db);
        $user = $database->findData_ASSOC("users", "Email, Login", "Email='{$to_find}' OR Login='{$to_find}'");
        if($user)
        {
            return (true);
        }
        return (false);
    }

    /**
     * @param $email
     * @return bool
     */
    protected final function sendRecMail($to_find){
        $database = new DatabaseRequest($this->db);
        $user = $database->findData_ASSOC("users", "Email, Login, token", "Email='{$to_find}' OR Login='{$to_find}'");
        $token = $user[0]['token'];
        $encoding = "utf-8";
        $mail_to = $user[0]["Email"];
        $mail_subject = "Repair password.";
        $mail_message = "<div style='font-size:10pt; font-style:italic; color:#006699;'>Здравствуйте, ". $user[0]["Login"].",
                Для восстановления пароля нажмите:<br/>

        <a href='http://e3r7p9:3000/repair?token=".$token."'><button style='outline: none;
                        height: 1.7em;
                        width: 10em;
                        font-size: 2vw;
                        border-radius:  0.5vw;
                        color: white;
                        background-color: #08558b;'>Восстановить</button></a></div>";
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
}