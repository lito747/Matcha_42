<?php
/**
 * Created by PhpStorm.
 * User: Дмитрий
 * Date: 24.10.2018
 * Time: 18:44
 */

namespace App\Models;


use App\Controllers\Controller;
use App\Database\DatabaseRequest;

/**
 * Class Likes
 * @package App\Models
 */
class Likes extends Controller{
    /**
     * @param $sourceToken
     * @param $targetToken
     * @return array
     */
    public final function like($sourceToken, $targetToken){
        $database = new DatabaseRequest($this->db);
        $user1 = $database->findData_ASSOC('users', "UserID", "token='{$sourceToken}'");
        $user2 = $database->findData_ASSOC("users", "UserID", "token='{$targetToken}'");
        if (!$user1 || !$user2) {
            return [
                'status' => false,
                'message' => "Error: cant find users with this token!",
            ];
        }
        if ($database->findData_ASSOC('blacklist','BlackID', "(token2='{$sourceToken}' AND token1='{$targetToken}') OR (token2='{$targetToken}' AND token1='{$sourceToken}')"))
        {
            return [
                'status' => false,
                'message' => "One of users on blacklist",
            ];
        }
        $toLike = $database->findData_ASSOC('Likes',"LikeID, sourceID, targetID, sourceToken, targetToken",
            "sourceToken='{$sourceToken}' AND targetToken='{$targetToken}'");
        if (empty($toLike)) {
            $database->addTableData('Likes', "sourceID, targetID, sourceToken, targetToken",
                "'{$user1[0]['UserID']}', '{$user2[0]['UserID']}', '{$sourceToken}', '{$targetToken}'");
            return [
                "status" => true,
                "message" => "User has been liked.",
            ];
        } else {
            return [
                "status" => false,
                "message" => "User already Liked. Like ID: {$toLike[0]['LikeID']}, liked user ID: {$toLike[0]['targetID']}.",
            ];
        }
    }

    /**
     * @param $sourceToken
     * @param $targetToken
     * @return array
     */
    public final function unlike($sourceToken, $targetToken){
        $database = new DatabaseRequest($this->db);
        $user1 = $database->findData_ASSOC("users", "UserID", "token='{$sourceToken}'");
        $user2 = $database->findData_ASSOC('users', "UserID", "token='{$targetToken}'");
        if (!$user1 || !$user2) {
            return [
                'status' => false,
                'message' => "Error: cant find users with this token!",
            ];
        }
        if ($database->findData_ASSOC('blacklist','BlackID', "(token2='{$sourceToken}' AND token1='{$targetToken}') OR (token2='{$targetToken}' AND token1='{$sourceToken}')"))
        {
            return [
                'status' => false,
                'message' => "One of users on blacklist",
            ];
        }
        $toLike = $database->findData_ASSOC('Likes',"LikeID, sourceID, targetID, sourceToken, targetToken",
            "sourceToken= '{$sourceToken}' AND targetToken='{$targetToken}'");
        if (!empty($toLike)) {
            $database->deleteTableData('Likes',
                "sourceToken= '{$sourceToken}' AND targetToken='{$targetToken}'");
            return [
                "status" => true,
                "message" => "User has been unliked.",
            ];
        } else {
            return [
                "status" => false,
                "message" => "User already not liked.",
            ];
        }
    }

    /**
     * @param $sourceToken
     * @return array
     */
    public final function reviewLikes($sourceToken){
        $database = new DatabaseRequest($this->db);
        $user = $database->findData_ASSOC('users', "UserID", "token='{$sourceToken}'");
        if (!$user) {
            return [
                "status" => false,
                "message" => "Error: Token does not exist or was overridden.",
                "info" => [],
            ];
        }
        $like = $database->findData_ASSOC('Likes LEFT JOIN users ON users.token=likes.targetToken',
            "likes.targetID, likes.targetToken AS token, users.Avatar AS Avatar, CONCAT(users.FirstName, ' ', users.LastName) AS Name, users.City AS City, users.Country AS Country, users.Age AS Age, users.Gender AS Gender",
            "sourceID='{$user[0]['UserID']}' AND sourceToken='{$sourceToken}'");
        if ($like) {
            return [
                "status" => true,
                "message" => "All liked users.",
                "info" => $like,
            ];
        } else {
            return [
                "status" => true,
                "message" => "There is no users that was liked.",
                "info" => [],
            ];
        }
    }

    /**
     * @param $sourceToken
     * @param $targetToken
     * @return array
     */
    public final function checkIfLiked($sourceToken, $targetToken){
        $database = new DatabaseRequest($this->db);
        $user1 = $database->findData_ASSOC('users', "UserID", "token='{$sourceToken}'");
        $user2 = $database->findData_ASSOC('users', "UserID", "token='{$targetToken}'");
        if (!$user1 || !$user2) {
            return [
                "status" => false,
                "message" => "Error: Token does not exist or was overridden.",
                "liked" => false,
            ];
        }
        $isLike = $database->findData_ASSOC('Likes',"LikeID, sourceID, targetID, sourceToken, targetToken",
            "targetToken='{$sourceToken}' AND targetID='{$user1[0]['UserID']}' AND sourceToken='{$targetToken}' AND sourceID='{$user2[0]['UserID']}'");
        if ($isLike) {
            return [
                "status" => true,
                "message" => "User ID: {$user1[0]['UserID']} Liked by ID: {$user2[0]['UserID']}.",
                "liked" => true,
            ];
        } else {
            return [
                "status" => true,
                "message" => "User ID: {$user1[0]['UserID']} not Liked by ID: {$user2[0]['UserID']}.",
                "liked" => false,
            ];
        }
    }

    /**
     * @param $token
     * @return array
     */
    protected final function likedBy($token)
    {
        $database = new DatabaseRequest($this->db);
        $user = $database->findData_ASSOC('users', "UserID", "token='{$token}'");
        if (!$user) {
            return [
                "status" => false,
                "message" => "Error: Token does not exist or was overridden.",
                "info" => [],
            ];
        }
        $like = $database->findData_ASSOC('Likes LEFT JOIN users ON users.token=likes.sourceToken',
            "likes.sourceID, likes.sourceToken AS token, users.Avatar AS Avatar, CONCAT(users.FirstName, ' ', users.LastName) AS Name, users.City AS City, users.Country AS Country, users.Age AS Age, users.Gender AS Gender",
            "targetID='{$user[0]['UserID']}' AND targetToken='{$token}'");
        if ($like) {
            return [
                "status" => true,
                "message" => "All users who like you.",
                "info" => $like,
            ];
        } else {
            return [
                "status" => true,
                "message" => "There is no users that was liked.",
                "info" => [],
            ];
        }
    }
}