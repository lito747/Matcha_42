<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/22/18
 * Time: 7:51 PM
 */

namespace App\Models;


use App\Controllers\Controller;
use App\Database\DatabaseRequest;

/**
 * Class Notification
 * @package App\Models
 */
class Notification extends Controller
{
    /**
     * @param $data
     * @return array
     * @internal param $token
     */
    protected final function checkNotification($data)
    {
        $token = htmlspecialchars(addslashes($data['token']));
        $database = new DatabaseRequest($this->db);
        $notification = $database->findData_ASSOC("notification",
            "NID, Type, sourceID, sourceName, TargetID, TargetName, TargetToken",
            "TargetToken='{$token}' AND Shown='0'");
        $database->updateTableData('users', "data=NOW()", "token='{$token}'");
        if($notification) {
            for ($i = 0; $notification[$i]; $i++) {
                $database->updateTableData("notification", "Shown='1'","NID='{$notification[$i]['NID']}'");
            }
        }
        else{
            return [
                'notification' => false,
                'message' => "No new notifications",
            ];
        }
        return [
            'notification' => true,
            'message' => $notification,
            'all_notifications' => ($database->findData_ASSOC('notification',
                "NID, Type, sourceID, sourceName, TargetID, TargetName, TargetToken", "TargetToken='{$token}' ORDER BY NID DESC"))
        ];
    }

    /**
     * @param $sourceToken
     * @param $targetToken
     * @param $Type
     * @return bool
     */
    protected final function addNotification($sourceToken, $targetToken, $Type)
    {
        $database = new DatabaseRequest($this->db);
        $target = $database->findData_ASSOC('users', "UserID, CONCAT(FirstName, ' ', LastName) as Name", "token='{$targetToken}'");
        $source = $database->findData_ASSOC('users', "UserID, CONCAT(FirstName, ' ', LastName) as Name", "token='{$sourceToken}'");
        if ($database->findData_ASSOC('blacklist','BlackID', "(token2='{$sourceToken}' AND token1='{$targetToken}') OR (token2='{$targetToken}' AND token1='{$sourceToken}')"))
        {
            return false;
        }
        if ($target && $source) {
            $database->addTableData("notification", "Type, sourceID, sourceName, TargetID, TargetName, TargetToken",
                "'{$Type}', '{$source[0]['UserID']}', '{$source[0]['Name']}', '{$target[0]['UserID']}', '{$target[0]['Name']}', '{$targetToken}'");
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @param $data
     * @return array
     */
    protected final function allNotification($data)
    {
        $token = htmlspecialchars(addslashes($data['token']));
        $database = new DatabaseRequest($this->db);
        $notification = $database->findData_ASSOC('notification',
            "NID, Type, sourceID, sourceName, TargetID, TargetName, TargetToken", "TargetToken='{$token}' ORDER BY NID DESC");
        if($notification) {
            return [
                'notification' => true,
                'all_notifications' => $notification
            ];
        }
        else{
            return [
                'notification' => false,
                'message' => "No new notifications",
            ];
        }
    }
}