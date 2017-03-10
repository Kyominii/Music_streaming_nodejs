<?php

require_once("vendor/autoload.php");

$db = new DB();
$db -> addConnection(parse_ini_file("src/conf/conf.ini"));
$db -> setAsGlobal();
$db ->bootEloquent();

$app = new \Slim\App;

$app->get("/",function(){

});

$app->run();

