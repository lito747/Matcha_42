<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/27/18
 * Time: 3:33 PM
 */

namespace App\Models;


use App\Controllers\Controller;
use App\Database\DatabaseRequest;

/**
 * Class Chat
 * @package App\Models
 */
class Chat extends Controller
{
    /**
     * @param $token1
     * @param $token2
     * @param DatabaseRequest $database
     * @return bool
     */
    private function ifLiked($token1, $token2, DatabaseRequest $database)
    {
        $like1 = $database->findData_ASSOC('Likes',"LikeID, sourceID, targetID, sourceToken, targetToken",
            "targetToken='{$token1}' AND sourceToken='{$token2}'");
        $like2 = $database->findData_ASSOC('Likes',"LikeID, sourceID, targetID, sourceToken, targetToken",
            "targetToken='{$token2}' AND sourceToken='{$token1}'");
        if ($like1 && $like2) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param $token
     * @param $room
     * @param $msg
     * @return array
     */
    protected final function onSend($token, $room, $msg)
    {
        $database = new DatabaseRequest($this->db);
        $room = $database->findData_ASSOC('chat_room', "*", "roomID='{$room}' AND (token1='{$token}' OR token2='{$token}')")[0];
        $user = $database->findData_ASSOC('users', 'UserID', "token='{$token}'")[0];
        if(!$user) {
            return [
                'Error' => 'Cant find token!',
                'status' => false,
                'token' => false,
            ];
        }
        if (!$room)
        {
            return [
                'Error' => "Cant find this room",
                'status' => false,
                'token' => true,
            ];
        }
        if ($room['token1'] == $token) {
            $receiverToken = $room['token2'];
        } else{
            $receiverToken = $room['token1'];
        }
        $database->addTableData("messages", "roomID, senderToken, receiverToken, message", "'{$room['roomID']}', '{$token}', '{$receiverToken}', '{$msg}'");
        return [
            "status" => true,
            'token' => true,
            'receiver' => $receiverToken
        ];
    }

    /**
     * @param $token
     * @param $room
     * @return array
     */
    protected final function onGetMessage($token, $room)
    {
        $room = htmlspecialchars(addslashes($room));
        $database = new DatabaseRequest($this->db);
//        $checkRoom = $database->findData_ASSOC('chat_room', "*", "roomID='{$room}' AND (token1='{$token}' OR token2='{$token}') LIMIT 1")[0];
        $user = $database->findData_ASSOC('users', 'UserID', "token='{$token}' LIMIT 1")[0];
        if(!$user) {
            return [
                'Error' => 'Cant find token!',
                'messageStatus' => false,
                'token' => false,
            ];
        }
//        $message = $database->findData_ASSOC("messages", "*", "ORDER BY date DESC LIMIT 1");
        $message = $database->wildRequest("SELECT * FROM messages ORDER BY date DESC LIMIT 1")[0];
        if ($message['roomID'] != $room)
        {
            return [
                'messageStatus' => false,
                'token' => true,
                'message' => false
            ];
        }
        $message['sender'] = $database->findData_ASSOC('users', "CONCAT(FirstName, ' ', LastName) AS Name, Avatar", "token='{$message['senderToken']}' LIMIT 1")[0];
        return[
            'messageStatus' => true,
            'message' => $message,
            'token' => true,
        ];
    }

    /**
     * @param $room
     * @param $token
     * @return array
     */
    protected final function history($token, $room)
    {
        $room = htmlspecialchars(addslashes($room));
        $database = new DatabaseRequest($this->db);
        $user = $database->findData_ASSOC('users', 'UserID', "token='{$token}' LIMIT 1")[0];
        if(!$user) {
            return [
                'Error' => 'Cant find token!',
                'messageStatus' => false,
                'token' => false,
                'message' => false,
            ];
        }
        $messages = $database->findData_ASSOC("messages", "*", "roomID='{$room}' ORDER BY date ASC");
        for ($i = 0; $messages[$i]; $i++)
        {
            $messages[$i]['sender'] = $database->findData_ASSOC('users', "CONCAT(FirstName, ' ', LastName) AS Name, Avatar", "token='{$messages[$i]['senderToken']}' LIMIT 1")[0];
        }
        return[
            'messageStatus' => true,
            'message' => $messages,
            'token' => true,
        ];
    }

    /**
     * @param $token1
     * @param $token2
     * @return array
     */
    protected final function newRoom($token1, $token2)
    {
        $database = new DatabaseRequest($this->db);
        $users = $database->findData_ASSOC('users', 'UserID', "token IN ('{$token1}','{$token2}')");
        if (!$users[0] || !$users[1])
        {
            return [
                'creation' => false,
                'token' => false,
                'roomID' => false,
            ];
        }
        if (!$this->ifLiked($token1, $token2, $database)){
            return [
                'token' => true,
                'roomID' => false,
                'creation' => false,
                'liked' => false,
            ];
        }
        if(!($room = $database->findData_ASSOC('chat_room', "roomID", "(token1='{$token1}' AND token2='{$token2}') OR (token1='{$token2}' AND token2='{$token1}') LIMIT 1")[0]['roomID']))
        {
            $database->addTableData("chat_room", "token1, token2", "'{$token1}','{$token2}'");
            $room = $database->findData_ASSOC('chat_room', "roomID", "(token1='{$token1}' AND token2='{$token2}') OR (token1='{$token2}' AND token2='{$token1}') LIMIT 1")[0]['roomID'];
            return[
                'creation' => true,
                'token' => true,
                'roomID' => $room,
            ];
        } else {
            return[
                'creation' => false,
                'token' => true,
                'roomID' => $room,
            ];
        }
    }

    /**
     * @param $token1
     * @param $token2
     * @return array
     */
    protected final function findRoom($token1, $token2)
    {
        $database = new DatabaseRequest($this->db);
        $users = $database->findData_ASSOC('users', 'UserID', "token IN ('{$token1}','{$token2}')");
        if (!$users[0] || !$users[1])
        {
            return [
                'token' => false,
                'roomID' => false,
            ];
        }
        if (!$this->ifLiked($token1, $token2, $database)){
            return [
                'token' => true,
                'roomID' => false,
                'liked' => false,
            ];
        }
        $room = $database->findData_ASSOC('chat_room', "roomID", "(token1='{$token1}' AND token2='{$token2}') OR (token1='{$token2}' AND token2='{$token1}') LIMIT 1")[0]['roomID'];
        return[
            'token' => true,
            'roomID' => $room,
        ];
    }
}