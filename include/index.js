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

function upload(files) {
    var f = files[0] ;

    // Only process image files.
    if (!f.type.match('image/jpeg')) {
        alert("The file must be a jpeg image") ;
        return false ;
    }
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

    $.ajax({
        type: 'POST',
        url: "SCRIPT TRAITEMENT",
        data: str,
            success: function(data) {
                alert("ok") ;
            },
            fail : function (data) {
                alert("non") ;
            }
    });
}

$("#fleche_droite").click(function () {
    $('.owl-carousel').trigger('next.owl.carousel');
});

$("#fleche_gauche").click(function () {
    $('.owl-carousel').trigger('prev.owl.carousel');

});

$('.owl-carousel').owlCarousel({
    loop: true,
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