<?php

require_once("vendor/autoload.php");

$app = new \Slim\App;

$app->get("/", function (Request $request, Response $response){
$response->getBody()->write("Hello World =)");
});

$app->run();

