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
        success:  function (response){envoiOk(response);},
        fail: function (response) {
            $("#dropfile_img").attr("src","assets/images/icon_upload_rouge.png");
        }
    });
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

function envoiOk(reponse) {
    $("#dropfile_img").attr("src","assets/images/icon_upload_vert.png");
    $("#dropfile").text("La musique a bien été envoyé");

}

function readfiles(files) {
    $("#dropfile").text("Envoi de la musique en cours");
    $("#dropfile_img").attr("src","assets/images/icon_upload.png");
    for (var i = 0; i < files.length; i++) {
        reader = new FileReader();
        reader.onload = function(event) { document.getElementById('input_musique').value = event.target.result;}
        reader.readAsDataURL(files[i]);
    }
}
var holder = document.getElementById('upload');
holder.ondrop = function (e) {
    e.preventDefault();
    readfiles(e.dataTransfer.files);
}