<?php
/**
 * Created by PhpStorm.
 * User: dkliukin
 * Date: 8/12/18
 * Time: 10:38 AM
 */

require '../vendor/autoload.php';
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
//use \App\Database\DatabaseRequest;

/**
 * Class ChatServer
 */
class ChatServer implements MessageComponentInterface
{
    protected $clients;
    protected $database;

    /**
     * ChatServer constructor.
     */
    public function __construct()
    {
        $this->clients = new \SplObjectStorage();
    }

    /**
     * @param ConnectionInterface $conn
     */
    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "New Connection! ({$conn->resourceId})";
    }

    /**
     * @param ConnectionInterface $from
     * @param string $msg
     */
    public function onMessage(ConnectionInterface $from, $msg)
    {
        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s'."\n",
            $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');
        foreach ($this->clients as $client) {
            $client->send($msg);
        }
    }

    /**
     * @param ConnectionInterface $conn
     */
    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    /**
     * @param ConnectionInterface $conn
     * @param Exception $e
     */
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occured: {$e->getMessage()}\n";
        $conn->close();
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new ChatServer()
        )
    ),
    8101
);

$server->run();