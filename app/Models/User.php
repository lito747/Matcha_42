<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/2/18
 * Time: 12:13 PM
 */

namespace App\Models;

use App\Controllers\Controller;
use App\Database\DatabaseRequest;
use PDO;

/**
 * Class User
 * @package App\Models
 */
class User extends Controller
{
    /**
     * @param $params
     * @param DatabaseRequest $database
     * @return bool
     */
    private final function checkLogin($params, DatabaseRequest $database){
        $Login = htmlspecialchars(addslashes($params['Login']));
        $data = $database->findData_ASSOC("users", "Login","Login='{$Login}'");
        if(!empty($data)) {
            return (true);
        }
        return (false);
    }

    /**
     * @param $params
     * @param DatabaseRequest $database
     * @return bool
     */
    private final function checkEmail($params, DatabaseRequest $database){
        $Email = htmlspecialchars(addslashes($params['Email']));
        $data = $database->findData_ASSOC("users", "Email","Email='{$Email}'");
        if(!empty($data)) {
            return (true);
        }
        return (false);
    }

    /**
     * @param $Email
     * @return int
     */
    private final function validateEmail($Email){
        if(preg_match('#(.+?)\@([a-z0-9-_]+)\.(aero|arpa|asia|biz|cat|ua|tv|ru|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])#i', $Email)) {
            return (true);
        } else {
            return (false);
        }
    }

    /**
     * @param $Tags
     * @param $token
     * @param DatabaseRequest $database
     */
    private function updateUserTags($Tags, $token, DatabaseRequest $database){
        $Tags = preg_replace('/\s+/', '', $Tags);
        $TagsArray = explode('#',"$Tags");
        $TagsArray = array_unique($TagsArray);
        array_shift($TagsArray);
        $userID = $database->findData_ASSOC('users', "UserID", "token='{$token}'")[0]['UserID'];
        $tag = $database->findData_ASSOC('user_tag LEFT JOIN Tags ON Tags.tid == user_tag.tag', "Tags.tid AS ID, Tags.tag AS Tag","user_tag.user='{$userID}'");
        for ($i = 0; $tag[$i]; $i++) {
            $noDel = false;
            for ($j = 0; $TagsArray[$j]; $j++) {
                if ($tag[$i]['Tag'] == $TagsArray[$j]) {
                    $noDel = true;
                    break ;
                }
            }
            if (!$noDel) {
                $database->deleteTableData('user_tag', "user='{$userID}' AND tag='{$tag[$i]['ID']}'");
            }
        }
        for($i = 0;$TagsArray[$i]; $i++) {
            $current_tag = htmlspecialchars(addslashes($TagsArray[$i]));
            $tag = $database->findData_ASSOC('Tags', 'tid', "tag='$current_tag'");

            if ($tag[0]['tid'] == null) {
                $database->addTableData('Tags', "tag", "'{$current_tag}'");
                $tag = $database->findData_ASSOC('Tags', 'tid', "tag='{$current_tag}'");
            }
            if ($userID && $tag[0]['tid'] && !$database->findData_ASSOC("user_tag",'*', "user='{$userID}' AND tag='{$tag[0]['tid']}'")) {
                $database->addTableData("user_tag", "user, tag", "$userID ,{$tag[0]['tid']}");
            }
        }
    }

    /**
     * @param $request
     * @param $token
     * @param DatabaseRequest $database
     */
    private function sendUpdData($request, $token, DatabaseRequest $database){
        $params = "Age='".htmlspecialchars(addslashes($request['Age']))."', Email='".htmlspecialchars(addslashes($request['Email']))."', Login='".htmlspecialchars(addslashes($request['Login']))."',
            City='".htmlspecialchars(addslashes($request['City']))."', Country='".htmlspecialchars(addslashes($request['Country']))."', FirstName='".htmlspecialchars(addslashes($request['FirstName']))."',
            Gender='{$request['Gender']}', LastName='".htmlspecialchars(addslashes($request['LastName']))."', Preference='".htmlspecialchars(addslashes($request['Preferences']))."',
            Orientation='{$request['Sexpref']}', Bio='".htmlspecialchars(addslashes($request['Bio']))."', map_height='{$request['lng']}', map_width='{$request['lat']}'";
        return $database->updateTableData("users", $params, "token='{$token}'");
    }

    /**
     * @return array
     */
    private function basicUdpCheck()
    {
        return $toCheck = [
            'Login' => false,
            'Email' => false,
        ];
    }

    /**
     * @param $token
     * @param $data
     * @return array
     */
    protected final function update($token, $data)
    {
        $checkStatus = $this->basicUdpCheck();
        $database = new DatabaseRequest($this->db);
        $database->UseDB("db_matcha");
        $user = $database->findData_ASSOC("users", "*", "token='{$token}'")[0];
        if (strtolower($data['Login']) == strtolower($user['Login'])) {
            $checkStatus['Login'] = true;
        } else {
            $checkStatus['Login'] = true;
        }
        if (strtolower($data['Email']) == strtolower($user['Email'])){
            $checkStatus['Email'] = true;
        } else {
            $checkStatus['Email'] = $this->validateEmail($data['Email']);
        }
        if (!$checkStatus['Email'] || !$checkStatus['Login']) {
            return [
                'update' => false,
                'status' => $checkStatus,
            ];
        }
        $checkStatus['updateRequest'] = $this->sendUpdData($data, $token, $database);
        $this->updateUserTags($data['Tags'], $token, $database);
        return [
            'update' => true,
            'status' => $checkStatus,
        ];
    }

    /**
     * @param $Tags
     * @param $token
     */
    private function addUserTags($Tags, $token){
        $Tags = preg_replace('/\s+/', '', $Tags);
        $TagsArray = explode('#',"$Tags");
        $TagsArray = array_unique($TagsArray);
        array_shift($TagsArray);
        $database = new DatabaseRequest($this->db);
        $userID = $database->findData_ASSOC('users', "UserID", "token='{$token}'");
        $userID = $userID[0]['UserID'];
        $i = 0;
        while($TagsArray[$i])
        {
            $tag = $database->findData_ASSOC('Tags', 'tid', "tag='$TagsArray[$i]'");

            if ($tag[0]['tid'] == null)
            {
                $database->addTableData('Tags', "tag", "'{$TagsArray[$i]}'");
                $tag = $database->findData_ASSOC('Tags', 'tid', "tag='{$TagsArray[$i]}'");
            }
            if ($userID && $tag[0]['tid'] && !$database->findData_ASSOC("user_tag",'*', "user='{$userID}' AND tag='{$tag[0]['tid']}'")) {
                $database->addTableData("user_tag", "user, tag", "$userID ,{$tag[0]['tid']}");
            }
            $i++;
        }

    }

    /**
     * @param $user
     * @return bool
     */
    public final function userGenerator($users)
    {
        $database = new DatabaseRequest($this->db);
        $numOfUsers = $database->findData_ASSOC("users", "COUNT(*)", "1=1");
        if ($numOfUsers[0]['COUNT(0)'] > 500) {
            return (false);
        }
        for ($i = 0; $i < $users['info']['results']; $i++) {
            for ($j = $i + 1; $j < $users['info']['results']; $j++) {
                if ($users['results'][$i]["login"]['username'] == $users['results'][$j]["login"]['username']) {
                    $users['results'][$j]["login"]['username'] = $users['results'][$j]["login"]['username'] . $j . $users['results'][$i]['name']['first'];
                }
                if ($users['results'][$i]['email'] == $users['results'][$j]['email']) {
                    $users['results'][$j]['email'] = $users['results'][$i]['name']['first'] . "." . $users['results'][$j]['email'];
                }
            }
            $users['results'][$i]['name']['first'] = mb_convert_case($users['results'][$i]['name']['first'], MB_CASE_TITLE, "UTF-8");
            $users['results'][$i]['name']['last'] = mb_convert_case($users['results'][$i]['name']['last'], MB_CASE_TITLE, "UTF-8");
            $users['results'][$i]['location']['city'] = mb_convert_case($users['results'][$i]['location']['city'], MB_CASE_TITLE, "UTF-8");
            $users['results'][$i]['location']['state'] = mb_convert_case($users['results'][$i]['location']['state'], MB_CASE_TITLE, "UTF-8");
        }
        $req = "";
        for ($i = 0; $i < $users['info']['results']; $i++) {
            if ($i >= 1) {
                $req .= ", ";
            }
            $req .= "('{$users['results'][$i]["login"]["uuid"]}', '" . htmlspecialchars(addslashes($users['results'][$i]["login"]['username'])) . "', '" . hash("whirlpool", $users['results'][$i]['login']['password']) . "', '" . htmlspecialchars(addslashes($users['results'][$i]['email'])) . "',
             '" . htmlspecialchars(addslashes($users['results'][$i]['name']['first'])) . "', '" . htmlspecialchars(addslashes($users['results'][$i]['name']['last'])) . "', '" . htmlspecialchars(addslashes($users['results'][$i]['location']['city'])) . "', '" . htmlspecialchars(addslashes($users['results'][$i]['location']['state'])) . "', '{$users['results'][$i]['dob']['age']}', '" . rand(0, 128) . "', '{$users['results'][$i]['gender']}', 
             'Heterosexual', '{$users['results'][$i]['location']['coordinates']['longitude']}', {$users['results'][$i]['location']['coordinates']['latitude']}, '{$users['results'][$i]['picture']['large']}', '1', '1', '" . htmlspecialchars(addslashes("My name is {$users['results'][$i]['name']['first']}. I am {$users['results'][$i]['dob']['age']} years old and I am from {$users['results'][$i]['location']['city']}, {$users['results'][$i]['location']['state']}")) . "')";
        }
        $database->addTableBigData("users",
            "token, Login, Password, Email, FirstName, LastName, City,
            Country, Age, Popularity, Gender, Orientation, map_height,
            map_width, Avatar, Notification, FullRegister, Bio"
            , $req);
        for ($k = 0; $k < $users['info']['results']; $k++) {
            $tag = '#' . $users['results'][$k]['location']['city'] . " #" . $users['results'][$k]['location']['state'];
            $this->addUserTags($tag, $users['results'][$k]["login"]["uuid"]);
        }
        return ($req);
    }
}