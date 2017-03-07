<?php
/**
 * Created by PhpStorm.
 * User: Romain
 * Date: 07/03/2017
 * Time: 17:58
 */

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