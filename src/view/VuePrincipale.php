<?php

namespace view;

use Slim\Slim;

class VuePrincipale
{
    private $uri,$route;

    public function __construct()
    {
        $this->uri   = Slim::getInstance()->request->getRootUri();
        $this->route = Slim::getInstance()->request->getResourceUri();
    }

    public function render($content)
    {
        return self::renderHeader()+$content+self::renderFooter();
    }

    private function renderHeader()
    {
        $html = <<<END

END;
        return $html;
    }

    private function renderFooter()
    {
        $html = <<<END

END;
        return $html;
    }
}
