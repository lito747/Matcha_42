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
 * Class Report
 * @package App\Models
 */
class Report extends Controller
{
    /**
     * @param $reporter
     * @param $reported
     * @return bool
     */
    protected final function addFake($reporter, $reported){
        if (!(new DatabaseRequest($this->db))->findData_ASSOC('fake_acc', '*', "'{$reported}','{$reporter}'")) {
            if ((new DatabaseRequest($this->db))->addTableData('fake_acc', 'token, reporter', "'{$reported}','{$reporter}'")) {
                return true;
            }
            return false;
        }
        else{
            return false;
        }
    }
}