<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/28/18
 * Time: 1:34 PM
 */

namespace App\Models;


use App\Controllers\Controller;
use App\Database\DatabaseRequest;

/**
 * Class History
 * @package App\Models
 */
class History extends Controller
{
    /**
     * @param $token
     * @return array
     */
    protected final function allHistory($token)
    {
        $database = new DatabaseRequest($this->db);
        $history = $database->findData_ASSOC('history LEFT JOIN users ON history.viewedToken=users.token', "*", "history.userToken='{$token}'");
        if ($history)
        {
            return [
                'history' => $history,
                'status' => true,
            ];
        } else {
            return [
                'history' => [],
                'status' => false,
            ];
        }
    }

    /**
     * @param $viewer
     * @param $viewed
     * @return bool
     */
    protected final function addHistory($viewer, $viewed)
    {
        if((new DatabaseRequest($this->db))->addTableData('history', 'userToken, viewedToken', "'{$viewer}','{$viewed}'")) {
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * @param $token
     * @return array
     */
    protected final function visitorsHistory($token)
    {
        $database = new DatabaseRequest($this->db);
        $history = $database->findData_ASSOC('history LEFT JOIN users ON history.userToken=users.token', "*", "history.viewedToken='{$token}'");
        if ($history)
        {
            return [
                'history' => $history,
                'status' => true,
            ];
        } else {
            return [
                'history' => [],
                'status' => false,
            ];
        }
    }
}