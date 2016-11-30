var num = 12;
var zWin = $(window);

var render = function() {
    var tmpl = '';
    var padding = 2;
    var width = $(window).width();
    var height = $(window).height();
    var liWidth = Math.floor((width - padding * 3) / 4);
    for (var i = 1; i <= num; i++) {
        var p = padding;
        var imgSrc = 'imgs/' + i + '.jpg';
        if (i % 4 == 1) {
            p = 0;
        }
        tmpl += '<li class="animated bounceIn" data-id="' + i + '" style="width:' + liWidth + 'px; height:' + liWidth + 'px; padding-left:' + p + 'px; padding-top:' + padding + 'px;"><img src="' + imgSrc + '"></li>';
    }
    $("#img-lt").html(tmpl);
};
render();
var pid;
var wImg = $("#lar-img");
var domImage = wImg[0];
var loadImg = function(id, callback) {
    $("#img-lt").css({
        height: zWin.height(),
        'overflow': 'hidden'
    });
    $("#bigImg").css({
        width: zWin.width(),
        height: zWin.height()
    }).show();
    var imgsrc = 'imgs/' + id + '.jpg';
    var ImageObj = new Image();
    ImageObj.src = imgsrc;
    ImageObj.onload = function() {
        var w = this.width;
        var h = this.height;
        var winW = zWin.width();
        var winH = zWin.height();
        var pw = parseInt((winW - winH * (w / h)) / 2);
        var ph = parseInt((winH - winW * (h / w)) / 2);
        wImg.css({
            'width': 'auto',
            'height': 'auto'
        });
        wImg.css({
            'padding-left': '0px',
            'padding-top': '0px'
        });
        if (h / w > 1.2) {
            wImg.attr('src', imgsrc).css({
                'height': winH,
                'padding-left': pw + 'px'
            });
        } else {
            wImg.attr('src', imgsrc).css({
                'width': winW,
                'padding-top': ph + 'px'
            });
        }
        callback && callback();
    };
};

$("#img-lt").delegate('li', 'tap', function() {
    var id = pid = $(this).attr('data-id');
    loadImg(id);
});

$("#bigImg").tap(function() {
    $(this).hide();
    $("#img-lt").css({
        height: 'auto',
        'overflow': 'auto'
    });
});

$('#bigImg').mousedown(function(e) {
    e.preventDefault();
});

var lock = false;

$('#bigImg').swipeLeft(function() {
    if (lock) {
        return;
    }
    pid++;

    lock = true;
    loadImg(pid, function() {
        domImage.addEventListener('webkitAnimationEnd', function() {
            wImg.removeClass('animated bounceInRight');
            domImage.removeEventListener('webkitAnimationEnd');
            lock = false;
        }, false);
        wImg.addClass('animated bounceInRight');
    });
});

$("#bigImg").swipeRight(function() {
    if (lock) {
        return;
    }
    pid--;
    lock = true;
    loadImg(pid, function() {
        domImage.addEventListener('webkitAnimationEnd', function() {
            wImg.removeClass('animated bounceInRight');
            domImage.removeEventListener('webkitAnimationEnd');
            lock = false;
        }, false);
        wImg.addClass('animated bounceInRight');
    });

});