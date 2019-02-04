<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/2/18
 * Time: 1:26 PM
 */

namespace App\Controllers;
use Interop\Container\ContainerInterface;

/**
 * Class Controller
 * @package App\Controllers
 */
abstract class Controller
{
    protected $container;

    /**
     * Controller constructor.
     * @param ContainerInterface $c
     */
    public function __construct(ContainerInterface $c)
    {
        $this->container = $c;
    }

    /**
     * @param $name
     * @return mixed
     */
    public function __get($name)
    {
        if ($this->container->{$name}) {
            return $this->container->{$name};
        }
    }
}