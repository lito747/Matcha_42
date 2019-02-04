<?php

$db = new \App\Database\DatabaseRequest($container->db);

if($db->createDataBase("db_matcha")) {
    $db->UseDB("db_matcha");

    /**
     * User Table creation
     */

    if (!$db->wildRequest("SHOW TABLES LIKE 'Users'")) {
        $db->createTable("Users", "UserID");
        $db->addTableColumn("Users", "token", "varchar(255) UNIQUE");
        $db->addTableColumn("Users", "Login", "varchar(100) NOT NULL UNIQUE");
        $db->addTableColumn("Users", "Password", "varchar(512)");
        $db->addTableColumn("Users", "Email", "varchar(100) NOT NULL UNIQUE");
        $db->addTableColumn("Users", "FirstName", "varchar(100)");
        $db->addTableColumn("Users", "LastName", "varchar(100)");
        $db->addTableColumn("Users", "City", "varchar(100)");
        $db->addTableColumn("Users", "Country", "varchar(100)");
        $db->addTableColumn("Users", "Age", "varchar(100)");
        $db->addTableColumn("Users", "Popularity", "INT(16) UNSIGNED NOT NULL DEFAULT '0'");
        $db->addTableColumn("Users", "Gender", "varchar(100)");
        $db->addTableColumn("Users", "Orientation", "varchar(100)");
        $db->addTableColumn("Users", "map_height", "FLOAT(10)");
        $db->addTableColumn("Users", "map_width", "FLOAT(10)");
        $db->addTableColumn("Users", "Bio", "varchar(5000)");
        $db->addTableColumn("Users", "Preference", "varchar(2000)");
        $db->addTableColumn("Users", "Avatar", "varchar(100)");
        $db->addTableColumn("Users", "Notification", "varchar(1) DEFAULT '1'");
        $db->addTableColumn("Users", "FullRegister", "varchar(1) DEFAULT '0'");
        $db->addTableColumn("Users", "EmailConfirm", "varchar(1) DEFAULT '0'");
        $db->addTableColumn("Users", "Deleted", "varchar(1) DEFAULT '0'");
        $db->addTableColumn("Users", "data", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
    }

    /**
     * Tags
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'Tags'")) {
        $db->createTable("Tags", 'tid');
        $db->addTableColumn("Tags", "tag", "varchar(20)");
    }
    /**
     * User Tag
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'user_tag'")) {
        $db->createTable("user_tag", 'id');
        $db->addTableColumn('user_tag', 'user', 'INT(11)');
        $db->addTableColumn('user_tag', 'tag', 'INT(11)');
    }
    /**
     * Photo Table creation
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'Pictures'")) {
        $db->createTable("Pictures", "PicID");
        $db->addTableColumn("Pictures", "UserID", "INT(11)");
        $db->addTableColumn("Pictures", "url", "varchar(1000)");
        $db->addTableColumn("Pictures", "avatar", "INT(1)");
        $db->addTableColumn("Pictures", "data", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
    }
//    /**
//     * Temp users
//     */
//
//    $db->createTable("confirmation", "UID");
//    $db->addTableColumn("confirmation", "Login", "varchar(100) NOT NULL UNIQUE");
//    $db->addTableColumn("confirmation", "Passwd", "varchar(100)");
//    $db->addTableColumn("confirmation", "Email", "varchar(100) NOT NULL UNIQUE");
//    $db->addTableColumn("confirmation", "hash", "varchar(256)");

    /**
     * Likes Table creation
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'Likes'")) {
        $db->createTable("Likes", "LikeID");
        $db->addTableColumn("Likes", "sourceToken", "varchar(256)");
        $db->addTableColumn("Likes", "sourceID", "INT(11)");
        $db->addTableColumn("Likes", "targetToken", "varchar(256)");
        $db->addTableColumn("Likes", "targetID", "INT(11)");
    }
    /**
     * Comments Table Creation
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'Comments'")) {
        $db->createTable("Comments", "ComID");
        $db->addTableColumn("Comments", "UserID", "INT(11)");
        $db->addTableColumn("Comments", "UserName", "varchar(100)");
        $db->addTableColumn("Comments", "PicID", "INT(11)");
        $db->addTableColumn("Comments", "text", "varchar(1000)");
        $db->addTableColumn("Comments", "data", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
    }
    /**
     * Topics table creation
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'Topics'")) {
        $db->createTable("Topics", "TopicID");
        $db->addTableColumn("Topics", "Owner", "varchar(100)");
        $db->addTableColumn("Topics", "UserID", "INT(11)");
        $db->addTableColumn("Topics", "Title", "varchar(100)");
        $db->addTableColumn("Topics", "Description", "varchar(1000)");
        $db->addTableColumn("Topics", "TopicCreationDate", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
    }
    /**
     * Topics Messegess
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'TopicComments'")) {
        $db->createTable("TopicComments", "TCommentID");
        $db->addTableColumn("TopicComments", "UserID", "INT(11)");
        $db->addTableColumn("TopicComments", "TopicID", "INT(11)");
        $db->addTableColumn("TopicComments", "Comment", "varchar(10000)");
        $db->addTableColumn("TopicComments", "CreationDate", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
    }
    /**
     * Black list
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'blacklist'")) {
        $db->createTable("blacklist", "BlackID");
        $db->addTableColumn("blacklist", "UID1", "INT(11)");
        $db->addTableColumn("blacklist", "token1", "varchar(255)");
        $db->addTableColumn("blacklist", "UID2", "INT(11)");
        $db->addTableColumn("blacklist", "token2", "varchar(255)");
    }
    /**
     * Fake account
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'fake_acc'")) {
        $db->createTable("fake_acc", "fakeID");
        $db->addTableColumn("fake_acc", "token", "varchar(255)");
        $db->addTableColumn("fake_acc", "reporter", "varchar(255)");
        $db->addTableColumn("fake_acc", "CreationDate", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
    }

    /**
     * History of visiting
     */

//    if ($db->wildRequest("SHOW TABLES LIKE 'history'")) {
        $db->createTable('history', 'historyID');
        $db->addTableColumn('history', "userToken", "varchar(255)");
        $db->addTableColumn('history', "viewedToken", "varchar(255)");
        $db->addTableColumn('history', "viewedDate", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
//    }

    /**
     *  Notification (Temporary likes and messages)
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'Notification'")) {
        $db->createTable("Notification", "NID");
        $db->addTableColumn("Notification", "Type", "varchar(100)");
        $db->addTableColumn("Notification", "sourceID", "INT(11)");
        $db->addTableColumn("Notification", "sourceName", "varchar(255)");
        $db->addTableColumn("Notification", "TargetID", "INT(11)");
        $db->addTableColumn("Notification", "TargetName", "varchar(255)");
        $db->addTableColumn("Notification", "TargetToken", "varchar(255)");
        $db->addTableColumn("Notification", "Shown", "INT(1) DEFAULT 0");
    }
    /**
     * Chat rooms
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'chat_room'")) {
        $db->createTable("chat_room", 'roomID');
        $db->addTableColumn("chat_room", "token1", "varchar(255)");
        $db->addTableColumn("chat_room", "token2", "varchar(255)");
    }
    /**
     * Chat Messages
     */
    if (!$db->wildRequest("SHOW TABLES LIKE 'messages'")) {
        $db->createTable("messages", "messageID");
        $db->addTableColumn("messages", "roomID", "INT(11)");
        $db->addTableColumn("messages", "senderToken", "varchar(255)");
        $db->addTableColumn("messages", "receiverToken", "varchar(255)");
        $db->addTableColumn("messages", "message", "varchar(1000)");
        $db->addTableColumn('messages', "date", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
    }
}