/**
 * Created by ophelien on 10/03/17.
 */
/*$("#menu_joueur_on").mouseenter(function () {
    $("#menu_joueur_contenu").fadeIn(50);
});
$("#menu_joueur_on").mouseleave(function () {
    $("#menu_joueur_contenu").fadeOut(50);
});*/
$().ready(function() {
    $("#menu").find(".menu").each(function (i, value) {
        $(value).click(function () {
            $(value).find("ul").slideToggle(300);
        });
    });
    $("#body").css("background-size","100% 500px");
});
