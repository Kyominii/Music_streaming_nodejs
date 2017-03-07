<?php

namespace view;


class VuePrincipale
{
    public static function render($content)
    {
        return self::renderHeader()+$content+self::renderFooter();
    }

    private static function renderHeader()
    {
        $html = <<<END

END;
        return $html;
    }

    private static function renderFooter()
    {
        $html = <<<END

END;
        return $html;
    }
}
