<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 10/27/18
 * Time: 7:03 PM
 */

namespace App\Models;


use App\Controllers\Controller;
use App\Database\DatabaseRequest;

/**
 * Class Popularity
 * @package App\Models
 */
class Popularity extends Controller
{
    /**
     * @param $token
     * @return bool
     */
    protected final function increase($token)
    {
        $database = new DatabaseRequest($this->db);
        $popularity = $database->findData_ASSOC('users', 'Popularity',"token='{$token}' LIMIT 1")[0]['Popularity'];
        $popularity = $popularity + 2;
        $database->updateTableData("users", "Popularity='{$popularity}'","token='{$token}'");
        return true;
    }
}