<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/7/18
 * Time: 11:43 AM
 */

namespace App\Models;
use \App\Controllers\Controller;
use \App\Database\DatabaseRequest;


/**
 * Class DisplayUsersInformation
 * @package App\Models
 */
class DisplayUsersInformation extends Controller
{
    /**
     * @param DatabaseRequest $database
     * @param string $token
     * @param $request
     * @return array
     */
    private function uploadPhoto(DatabaseRequest $database, string $token, $request){
        $user = $database->findData_ASSOC('users', "UserID, Login", "token='{$token}'");
        if (!file_exists('photos'))
        {
            mkdir("photos");
        }
        if (!file_exists("photos/{$user[0]['Login']}/")) {
            mkdir("photos/{$user[0]['Login']}");
        }
        $photos = [];
        $i = 0;
        while ($request['Pics'.$i]) {
            $avatar = (intval($i) == 0) ? 1 : 0;
            $pic = explode(",", $request['Pics' . $i]);
            $name = $user[0]['Login'] . uniqid();
            $src = "photos/{$user[0]['Login']}/$name.jpg";
            $photos[$i] = $src;
            $database->addTableData("pictures", "UserID, url, avatar", "'{$user[0]['UserID']}', '$src', '{$avatar}'");
            file_put_contents($src, base64_decode($pic[1]));
            $i++;
        }
        return $photos;
    }

    /**
     * @param $request
     * @param $token
     */
    private function sendData($request, $token){
        $database = new DatabaseRequest($this->db);
        $database->UseDB("db_matcha");
        $photos = $this->uploadPhoto($database, $token,$request);
        $params = "Age='{$request['Age']}',
            City='".htmlspecialchars(addslashes($request['City']))."', Country='".htmlspecialchars(addslashes($request['Country']))."',
            Gender='{$request['Gender']}', Preference='".htmlspecialchars(addslashes($request['Preferences']))."',
            Orientation='{$request['Sexpref']}', Bio='".htmlspecialchars(addslashes($request['Bio']))."', map_height='{$request['lat']}', map_width='{$request['lng']}', FullRegister='1'";
        if (count($photos) >= 1) {
            $params .= ", Avatar='{$photos[0]}'";
        }
        $database->updateTableData("users", $params, "token='{$token}'");
    }

    /**
     * @param $request
     * @param $response
     * @param $param
     */
    private function paramExist($request, &$response, $param){
        if (isset($request["{$param}"]) && !empty($request["{$param}"])) {
            $response["{$param}"] = true;
            $request["{$param}"] = htmlspecialchars(addslashes($request["{$param}"]));
        }
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
            $current_tag = htmlspecialchars(addslashes($TagsArray[$i]));
            $tag = $database->findData_ASSOC('Tags', 'tid', "tag='$current_tag'");

            if ($tag[0]['tid'] == null)
            {
                $database->addTableData('Tags', "tag", "'{$current_tag}'");
                $tag = $database->findData_ASSOC('Tags', 'tid', "tag='{$current_tag}'");
            }
            if ($userID && $tag[0]['tid'] && !$database->findData_ASSOC("user_tag",'*', "user='{$userID}' AND tag='{$tag[0]['tid']}'")) {
                $database->addTableData("user_tag", "user, tag", "$userID ,{$tag[0]['tid']}");
            }
            $i++;
        }
    }

    /**
     * @param $token
     * @return array
     */
    protected final function checkRegistration($token)
    {
        $database = new DatabaseRequest($this->db);
        $user = $database->findData_ASSOC('users', 'FullRegister', "token='{$token}'");
        if ($user) {
            return $json = [
                "Extend_Registration" => $user[0]['FullRegister']
            ];
        }
        else {
            return $json = [
                "Extend_Registration" => 1
            ];
        }
    }

    /**
     * @param $request
     * @param $token
     * @return array
     */
    protected final function checkExtendDate($request, $token){
        $response = [
            "Age" => false,
            "City" => false,
            "Country" => false,
            "Gender" => false,
            "Tags" => false,
            "Preferences" => false,
            "Sexpref" => false,
            "lat" => false,
            "lng" => false,
            "Bio" => false,
            "Complete" => true
        ];
        foreach ($response as $key => $value) {
            if ($key != "Complete") {
                $this->paramExist($request, $response, $key);
                if ($response[$key] == true) {
                    if ($key == "Age") {
                        if (intval($request[$key]) < 16 || intval($request[$key]) > 80) {
                            $response[$key] = false;
                        }
                    }
                }
            }
            $response['Complete'] *= $response[$key];
        }
        $response['Complete'] = boolval($response['Complete']);
        if (($response['Complete'] = boolval($response['Complete']))) {
            $this->sendData($request, $token);
            $this->addUserTags($request['Tags'], $token);
        }
        return $response;
    }
}