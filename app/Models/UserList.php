<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 9/25/18
 * Time: 2:41 PM
 */

namespace App\Models;


use App\Controllers\Controller;
use App\Database\DatabaseRequest;

/**
 * Class UserList
 * @package App\Models
 */
class UserList extends Controller
{
    /**
     * @param $data
     * @param $ulist
     */
    private final function maxValues(&$data, $ulist){
        $data['maxAge'] = 16;
        $data['maxPopular'] = 0;
        foreach ($ulist as $value)
        {
            if ($data['maxAge'] < $value['Age']) {
                $data['maxAge'] = $value['Age'];
            }
            if ($data['maxPopular'] < $value['Popularity']) {
                $data['maxPopular'] = $value['Popularity'];
            }
        }
    }

    /**
     * @param $ulist
     * @param DatabaseRequest $database
     */
    private final function userTags(&$ulist, DatabaseRequest $database){
        $i = 0;
        while ($ulist[$i])
        {
            $uid = $ulist[$i]['UserID'];
            $ulist[$i]['Tags'] = $database->findData_ASSOC("user_tag  LEFT JOIN tags ON user_tag.tag=tags.tid", "tags.tag", "user_tag.user='$uid'");
            $i++;
        }
    }

    /**
     *
     * @param $lat1
     * @param $lon1
     * @param $lat2
     * @param $lon2
     * @param $unit
     * @return float|int
     */

    function distance($lat1, $lon1, $lat2, $lon2, $unit) {

        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper($unit);

        if ($unit == "K") {
            return ($miles * 1.609344);
        } else if ($unit == "N") {
            return ($miles * 0.8684);
        } else {
            return $miles;
        }
    }

    /**
     * @param $data
     * @param $userToken
     */
    protected final function listOfUsers(&$data, $userToken){
        $database = new DatabaseRequest($this->db);
        $currentUser = $database->findData_ASSOC("users", "token, Avatar, Age, FirstName, LastName, Gender, Preference, UserID, Orientation, Popularity, Bio, map_height, map_width", "token='{$userToken}'");
        if ($currentUser[0]['Gender'] == 'male' && $currentUser[0]['Orientation'] == 'Heterosexual')
        {
            $gen = "'female'";
            $ori = "'Heterosexual', 'Bisexual'";
        } elseif ($currentUser[0]['Gender'] == 'female' && $currentUser[0]['Orientation'] == 'Heterosexual')
        {
            $gen = "'male'";
            $ori = "'Heterosexual', 'Bisexual'";
        } elseif ($currentUser[0]['Gender'] == 'male' && $currentUser[0]['Orientation'] == 'Homosexual')
        {
            $gen = "'male'";
            $ori = "'Homosexual', 'Bisexual'";
        } elseif ($currentUser[0]['Gender'] == 'female' && $currentUser[0]['Orientation'] == 'Homosexual')
        {
            $gen = "'female'";
            $ori = "'Homosexual', 'Bisexual'";
        } else {
            $gen = "'male', 'female'";
            $ori = "'Heterosexual', 'Homosexual', 'Bisexual'";
        }
        $ulist = $database->findData_ASSOC("users", "token, Avatar, Age, FirstName, LastName, Gender, Preference, UserID, Orientation, Popularity, Bio, map_height, map_width", "token<>'{$userToken}' AND FullRegister='1' AND Gender IN ($gen) AND Orientation IN ($ori)");
        $ulist = array_reverse($ulist);
        for ($i = 0; !empty($ulist[$i]); $i++)
        {
            if ($database->findData_ASSOC('blacklist','BlackID', "(token2='{$ulist[$i]['token']}' AND token1='{$userToken}') OR (token2='{$userToken}' AND token1='{$ulist[$i]['token']}')")) {
                unset($ulist[$i]);
                continue;
            }
        }
        $ulist = array_values($ulist);
        for ($i = 0; !empty($ulist[$i]); $i++)
        {
            $ulist[$i]['photos'] = $database->findData_ASSOC('Pictures', "PicID, url", "UserID='{$ulist[$i]['UserID']}'");
            $ulist[$i]['range'] = $this->distance($currentUser[0]['map_width'], $currentUser[0]['map_height'], $ulist[$i]['map_width'], $ulist[$i]['map_height'], "K");
            $ulist[$i]['Status'] = true;
        }

        $this->maxValues($data, $ulist);
        $this->userTags($ulist, $database);
        $this->userTags($currentUser, $database);
        $data['user'] = $currentUser[0];
        $data['users'] = $ulist;
        $data['message'] = "Users data were received";
    }

    /**
     * @param $token
     * @return mixed
     */
    protected final function getUser($token)
    {
        $database = new DatabaseRequest($this->db);
        $currentUser = $database->findData_ASSOC("users", "*", "token='{$token}'");
        $currentUser[0]['photos'] = $database->findData_ASSOC('Pictures', "PicID, url", "UserID='{$currentUser[0]['UserID']}'");
        $this->userTags($currentUser, $database);
        $currentUser = $currentUser[0];
        return $currentUser;
    }
}