<?php

require_once("vendor/autoload.php");

\conf\Eloquent::init('src/conf/conf.ini');

$app = new \Slim\App;

$app->get("/",function(){

});

$app->run();

