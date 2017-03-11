$(document).on('dragenter', '#dropfile', function() {
    $(this).css('color', 'red');
    return false;
});

$(document).on('dragover', '#dropfile', function(e){
    e.preventDefault();
    e.stopPropagation();
    $(this).css('color', 'red');
    return false;
});

$(document).on('dragleave', '#dropfile', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).css('color', 'white');
    return false;
});

$(document).on('drop', '#dropfile', function(e) {
    if(e.originalEvent.dataTransfer){
        if(e.originalEvent.dataTransfer.files.length) {
            // Stop the propagation of the event
            e.preventDefault();
            e.stopPropagation();
            $(this).css('color', 'green');
            // Main function to upload
            upload(e.originalEvent.dataTransfer.files);
        }
    }
    else {
        $(this).css('color', 'white');
    }
    return false;
});

var file;

function upload(files) {
    var f = files[0] ;

    file = f;
    // Only process image files.
    var reader = new FileReader();

    // When the image is loaded,
    // run handleReaderLoad function
    reader.onload = handleReaderLoad;

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
}

function handleReaderLoad(evt) {
    var pic = {};
    pic.file = evt.target.result.split(',')[1];

    var str = jQuery.param(pic);
/*
    $.ajax({
        type: 'POST',
        url: "../upload",
        data: str,
            success: function(data) {
                alert("ok") ;
            },
            fail : function (data) {
                alert("non") ;
            }
    });*/

    var pr = $.ajax("../",{
        type : "POST",
        context : this,
        data : str
    });
    pr.done(function(jqXHR, status, error){alert(0);});
    pr.fail(function(jqXHR, status, error){alert( "error loading data : "+ error);});
}


$("#fleche_droite").click(function () {
    $('.owl-carousel').trigger('next.owl.carousel');
});

$("#fleche_gauche").click(function () {
    $('.owl-carousel').trigger('prev.owl.carousel');

});

var nbItems = document.getElementsByClassName("item").length;
if($(window).width() >= 600){
    if($(window).width() >= 100){
        if(nbItems <= 5){
            $("#fleche_droite").fadeOut(0);
            $("#fleche_gauche").fadeOut(0);
        }
    }else{
        if(nbItems <= 3){
            $("#fleche_droite").fadeOut(0);
            $("#fleche_gauche").fadeOut(0);
        }
    }
}else{
    if(nbItems <= 1){
        $("#fleche_droite").fadeOut(0);
        $("#fleche_gauche").fadeOut(0);
    }
}

$('.owl-carousel').owlCarousel({
    loop: false,
    margin:10,
    dots: false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    }
});

$(".item").each(function (index, value) {
    $(value).mouseenter(function () {
       $(value).find(".info").stop().fadeIn(200);
        $(value).find(".info").click(function () {
            $("#frame_player").attr("src",$(value).attr("name"));
            $("#frame_player").fadeIn();
        });
    });
    $(value).mouseleave(function () {
        $(value).find(".info").stop().fadeOut(200);
    });
});