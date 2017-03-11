/*$(document).on('dragenter', '#dropfile', function() {
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

var fileUpload;

function upload(files) {

    var f = files[0] ;

    fileUpload = f;
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

    var str = jQuery.param(pic);*/
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
/*
<<<<<<< 518d1d591aabb3ff7bbecb6dff4c122b37ba004f
    var pr = $.ajax("../",{
        type : "POST",
        context : this,
        data : str
=======
alert(fileUpload);

    var pr = $.ajax({
        type: "POST",
        url: "../",
        enctype: 'multipart/form-data',
        data: {
            file: fileUpload
        }
    });
    pr.done(function(jqXHR, status, error){alert(0);});
    pr.fail(function(jqXHR, status, error){alert( "error loading data : "+ error);});
}
*/

function makeDroppable(element, callback) {

    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', true);
    input.style.display = 'none';

    input.addEventListener('change', triggerCallback);
    element.appendChild(input);

    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.add('dragover');
    });

    element.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('dragover');
    });

    element.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('dragover');
        triggerCallback(e);
    });

    element.addEventListener('click', function() {
        input.value = null;
        input.click();
    });

    function triggerCallback(e) {
        var files;
        if(e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if(e.target) {
            files = e.target.files;
        }
        callback.call(null, files);
    }
}

var element = document.querySelector('#upload');
function callback(files) {
    // Here, we simply log the Array of files to the console.
    console.log(files[0]);
    var formData = new FormData();
    formData.append("files", files);

// Choix de l'utilisateur à partir d'un input HTML de type file...
    formData.append("musique", files[0]);
/*

    var request = new XMLHttpRequest();
    request.open("POST", "../");
    request.send(formData);
*/
    $.ajax({
        url: '/',
        method: 'POST',
        contentType: false,
        data: formData,
        processData: false,
        success: function(response) {
            alert('Files uploaded successfully.');
        },
        fail: function (response) {
            alert("error "+response);
        }
    });/*
    $.ajax({
        // Your server script to process the upload
        url: '../',
        type: 'POST',

        // Form data
        data: formData,

        // Tell jQuery not to process data or worry about content-type
        // You *must* include these options!
        cache: false,
        contentType: false,
        processData: false,

        // Custom XMLHttpRequest
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        $('progress').attr({
                            value: e.loaded,
                            max: e.total,
                        });
                    }
                } , false);
            }
            return myXhr;
        },
    });*/
}
makeDroppable(element, callback);

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

function readfiles(files) {
    for (var i = 0; i < files.length; i++) {
        reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('input_musique').value = event.target.result;}
        reader.readAsDataURL(files[i]);
    }
}
var holder = document.getElementById('upload');
holder.ondrop = function (e) {
    e.preventDefault();
    readfiles(e.dataTransfer.files);
}