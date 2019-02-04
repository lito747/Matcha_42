<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 6/8/18
 * Time: 2:28 PM
 */

namespace App\Database;

use PDO;
use App\Models\User;
use PDOException;

/**
 * Class DatabaseRequest
 * @package App\Database
 */
class DatabaseRequest
{
    private $dbConnect;


    /**
     * DatabaseRequest constructor.
     * @param PDO $connection
     */
    public function __construct(PDO $connection)
    {
        if (!empty($connection)) {
            $this->dbConnect = $connection;
        }
    }

    /**
     * @param $dbname
     * @return int
     */
    public function createDataBase($dbname)
    {
        try {
            $this->dbConnect->exec("CREATE DATABASE {$dbname}");
        }
        catch (PDOException $ex)
        {
            return 0;
        }
        return 1;
    }

    /**
     * @param $dbname
     * @return int
     */
    public function UseDB($dbname)
    {
        try {
            $this->dbConnect->exec("USE {$dbname}");
        }
        catch (PDOException $ex)
        {
            echo "UseDB Connection to data base failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return 1;
    }

    /**
     * This function for disconnect you from server
     */
    public function dropConnection()
    {
        $this->dbConnect = NULL;
    }

    /**
     * @param $name
     * @param $ID
     * @return int
     */
    public function createTable($name, $ID)
    {
        try {
            $this->dbConnect->exec("CREATE TABLE {$name}({$ID} INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY)");
        }
        catch (PDOException $ex)
        {
            echo "createTable failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return 1;
    }

    /**
     * @param $name
     * @return int
     */
    public function clearTable($name)
    {
        try {
            $this->dbConnect->exec("TRUNCATE {$name}");
        }
        catch (PDOException $ex)
        {
            echo "clearTable failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return 1;
    }

    /**
     * @param $name
     * @return int
     */
    public function dropTable($name)
    {
        try {
            $this->dbConnect->exec("DROP TABLE {$name}");
        }
        catch (PDOException $ex)
        {
            echo "dropTable failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return 1;
    }

    /**
     * @param $dbname
     * @return int
     */
    public function dropDB($dbname)
    {
        try {
            $this->dbConnect->exec("DROP DATABASE"." ". $dbname);
        }
        catch (PDOException $ex)
        {
            echo "dropDB failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return 1;
    }

    /**
     * @param $tableName
     * @param $column
     * @param $param
     * @return int
     */
    public function addTableColumn($tableName, $column, $param)
    {
        try {
//            echo "ALTER TABLE {$tableName} ADD {$column} {$param}";
            $this->dbConnect->exec("ALTER TABLE {$tableName} ADD {$column} {$param}");
        }
        catch (PDOException $ex)
        {
            echo "addTableColumn failed: ".$ex->getMessage()."</br>";
            return (false);
        }
        return (true);
    }

    /**
     * @param $Table
     * @param $columns
     * @param $val
     * @return int
     */
    public function addTableData($Table, $columns, $val)
    {
        try {
//            return "INSERT INTO {$Table}({$columns}) VALUES ({$val})";
            $this->dbConnect->exec("INSERT INTO {$Table}({$columns}) VALUES ({$val})");
        }
        catch (PDOException $ex)
        {
//            echo "addTableData failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return 1;
    }

    /**
     * @param $Table
     * @param $columns
     * @param $val
     * @return int
     */
    public function addTableBigData($Table, $columns, $val)
    {
        try {
//            echo "INSERT INTO {$Table}({$columns}) VALUES ({$val})";
            $this->dbConnect->exec("INSERT INTO {$Table}({$columns}) VALUES {$val}");
        }
        catch (PDOException $ex)
        {
//            echo "addTableData failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return 1;
    }

    /**
     * @param $Table
     * @param $Params
     * @param $Where
     * @return int
     */
    public function updateTableData($Table, $Params, $Where)
    {
//        return "UPDATE {$Table} SET {$Params} WHERE 1=1 AND {$Where}";
        try {
            $this->dbConnect->exec("UPDATE {$Table} SET {$Params} WHERE 1=1 AND {$Where}");
        }
        catch (PDOException $ex)
        {
            echo "updateTableData failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return ['stat'=>1,
        'req' => "UPDATE {$Table} SET {$Params} WHERE 1=1 AND {$Where}"];
    }

    /**
     * @param $Table
     * @param $Where
     * @return int
     */
    public function deleteTableData($Table, $Where)
    {
        try {
            $this->dbConnect->exec("DELETE FROM {$Table} WHERE 1=1 AND {$Where}");
        }
        catch (PDOException $ex)
        {
            echo "ADD failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return 1;
    }


    /**
     * @param $Table
     * @param $data
     * @param $Where
     * @return array
     */
    public function findData_ASSOC($Table, $data, $Where)
    {
        $result = [];
        try {
//            return "SELECT {$data} FROM {$Table} WHERE 1=1 AND {$Where}";
            $prep = $this->dbConnect->prepare("SELECT {$data} FROM {$Table} WHERE 1=1 AND {$Where}");
            $prep->execute();
            $result = $prep->fetchAll(PDO::FETCH_ASSOC);
        }
        catch (PDOException $ex)
        {
            echo "findData_ASSOC failed: ".$ex->getMessage()."</br>";
        }
        return $result;
    }

    /**
     * @param $Table
     * @param $data
     * @param $Where
     * @return int
     */
    public function findData_OBJ($Table, $data, $Where)
    {
        $result = 0;
        try {
            $prep = $this->dbConnect->prepare("SELECT {$data} FROM {$Table} WHERE 1=1 AND {$Where}");
            $prep->execute();
            $result = $prep->fetchAll(PDO::FETCH_OBJ);
        }
        catch (PDOException $ex)
        {
            echo "findData_OBJ failed: ".$ex->getMessage()."</br>";
        }
        return $result;
    }

    /**
     * @param $Table
     * @param $data
     * @param $Where
     * @param $model
     * @return int
     */
    public function findData_CLASS($Table, $data, $Where, $model)
    {
        $result = 0;
        try {
            $prep = $this->dbConnect->prepare("SELECT {$data} FROM {$Table} WHERE 1=1 AND {$Where}");
            $prep->execute();
            $result = $prep->fetchAll(PDO::FETCH_CLASS, $model);
        }
        catch (PDOException $ex)
        {
            echo "findData_OBJ failed: ".$ex->getMessage()."</br>";
        }
        return $result;
    }

    public function wildRequest($request)
    {
        try {
            $prep = $this->dbConnect->prepare($request);
            $prep->execute();
            $result = $prep->fetchAll(PDO::FETCH_ASSOC);
        }
        catch (PDOException $ex)
        {
            echo "createTable failed: ".$ex->getMessage()."</br>";
            return 0;
        }
        return $result;
    }
}