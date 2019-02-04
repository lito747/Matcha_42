<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/22/18
 * Time: 8:37 PM
 */

namespace App\Models;


use App\Controllers\Controller;
use App\Database\DatabaseRequest;

class BlackList extends Controller
{
    protected final function blockUser($targetToken, $sourceToken){
        $database = new DatabaseRequest($this->db);
        $user1 = $database->findData_ASSOC("users", "UserID", "token='{$targetToken}'");
        $user2 = $database->findData_ASSOC('users', "UserID", "token='{$sourceToken}'");
        if (!$user1 || !$user2) {
            return [
                'status' => false,
                'message' => "Error: cant find users with this token!",
            ];
        }
        $toBlock = $database->findData_ASSOC('blacklist',"BlackID, UID1, UID2, token1, token2",
            "token1= '{$sourceToken}' AND token2='{$targetToken}'");
        if (empty($toBlock)) {
            $database->addTableData('blacklist', "UID1, UID2, token1, token2",
                "'{$user2[0]['UserID']}', '{$user1[0]['UserID']}', '{$sourceToken}', '{$targetToken}'");
            return [
                "status" => true,
                "message" => "User has been added to blacklist.",
            ];
        } else {
            return [
                "status" => false,
                "message" => "User already in blacklist. Blacklist ID: {$toBlock[0]['BlackID']}, Blocked user ID: {$toBlock[0]['UID2']}.",
            ];
        }
    }

    protected final function unblockUser($targetToken, $sourceToken){
        $database = new DatabaseRequest($this->db);
        $user1 = $database->findData_ASSOC("users", "UserID", "token='{$targetToken}'");
        $user2 = $database->findData_ASSOC('users', "UserID", "token='{$sourceToken}'");
        if (!$user1 || !$user2) {
            return [
                'status' => false,
                'message' => "Error: cant find users with this token!",
            ];
        }
        $toBlock = $database->findData_ASSOC('blacklist',"BlackID, UID1, UID2, token1, token2",
            "token1= '{$sourceToken}' AND token2='{$targetToken}'");
        if (!empty($toBlock)) {
            $database->deleteTableData('blacklist',
                "token1= '{$sourceToken}' AND token2='{$targetToken}'");
            return [
                "status" => true,
                "message" => "User has been deleted from blacklist.",
            ];
        } else {
            return [
                "status" => false,
                "message" => "User already deleted from blacklist.",
            ];
        }
    }

    protected final function getBlockedUsers($sourceToken){
        $database = new DatabaseRequest($this->db);
        $user = $database->findData_ASSOC('users', "UserID", "token='{$sourceToken}'");
        if (!$user) {
            return [
                "status" => false,
                "message" => "Error: Token does not exist or was overridden.",
                "info" => false,
            ];
        }
        $blacklist = $database->findData_ASSOC('blacklist LEFT JOIN users ON users.token=blacklist.token2',
            "blacklist.UID2, blacklist.token2 AS token, users.Avatar AS Avatar, CONCAT(users.FirstName, ' ', users.LastName) AS Name, users.City AS City, users.Country AS Country, users.Age AS Age, users.Gender AS Gender",
            "UID1='{$user[0]['UserID']}' AND token1='{$sourceToken}'");
        if ($blacklist) {
            return [
                "status" => true,
                "message" => "All blocked users.",
                "info" => $blacklist,
            ];
        } else {
            return [
                "status" => true,
                "message" => "There is no users in blacklist.",
                "info" => false,
            ];
        }
    }

    protected final function checkIfBlocked($UserToken, $TargetToken){
        $database = new DatabaseRequest($this->db);
        $user1 = $database->findData_ASSOC('users', "UserID", "token='{$UserToken}'");
        $user2 = $database->findData_ASSOC('users', "UserID", "token='{$TargetToken}'");
        if (!$user1 || !$user2) {
            return [
                "status" => false,
                "message" => "Error: Token does not exist or was overridden.",
                "blocked" => false,
            ];
        }
        $toBlock = $database->findData_ASSOC('blacklist',"BlackID, UID1, UID2, token1, token2",
            "token2='{$UserToken}' AND UID2='{$user1[0]['UserID']}' AND token1='{$TargetToken}' AND UID1='{$user2[0]['UserID']}'");
        if ($toBlock) {
            return [
                "status" => true,
                "message" => "User ID: {$user1[0]['UserID']} blocked by ID: {$user2[0]['UserID']}.",
                "blocked" => true,
            ];
        } else {
            return [
                "status" => true,
                "message" => "User ID: {$user1[0]['UserID']} not blocked by ID: {$user2[0]['UserID']}.",
                "blocked" => false,
            ];
        }
    }
}