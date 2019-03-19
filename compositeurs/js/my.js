var ddBox = document.getElementsByTagName("dd");
var fsId = document.getElementById("fullscreen");
var cadresId = document.getElementById("cadres");
var thetop = document.getElementById("haut");


function settingsCompo(){
//	 winHeight = $(window).height();
//	 $(".first-page").css({'margin-bottom':winHeight});
	 if($(window).width() < 650){
		 heightSpace = 5;
		 navSpace = 15;
		 $(fsId).hide();
	 } else {
		 heightSpace = 25;
		 navSpace = 39;
		 $(fsId).show;
	 }
}

function changeColors(){
	if ((that.parent().hasClass('baroque')) || (that.hasClass('ba'))) {
		$(cadresId).removeClass().addClass('baroque-color');
	}
	if ((that.parent().hasClass('classique')) || (that.hasClass('cl'))) {
		$(cadresId).removeClass().addClass('classique-color');
	}
	if ((that.parent().hasClass('romantique')) || (that.hasClass('ro'))) {
		$(cadresId).removeClass().addClass('romantique-color');
	}
	if ((that.parent().hasClass('moderne')) || (that.hasClass('mo'))) {
		$(cadresId).removeClass().addClass('moderne-color');
	}
}

function colorsBack(){
	if (!$('dt a').hasClass('active')) {
		$(cadresId).removeClass().addClass('color1');
	} else {
		$(cadresId).removeClass().addClass($('dt a.active').parent().attr('class')+('-color'));
	}
}
//banner
/*var scrollSpeed = 80;
var step = 1; 
var current = 0;

function scrollBg(){
	current -= step;
	$(thetop).css("background-position",current+"px 0");
}*/

//ready
$(document).ready(function($) {
$('p, em, i').hyphenate('fr');

//it's all about size
settingsCompo();
$(window).resize(function(){
	settingsCompo();
});

//accordion
$(ddBox).hide();
$('dt a').click(function(){
	that = $(this);
	if (that.hasClass('active')) {
		that.removeClass('active');
		$(cadresId).removeClass().addClass('color1');
		
		that.parent().next().slideUp();
	} else {
		$('dt a').removeClass('active');
		that.addClass('active');
		changeColors();
		
		$(ddBox).slideUp();
		that.parent().next().slideDown(400, function() {
			$.scrollTo('.active', 400, {offset: {top:-heightSpace} });
		});
	}
	return false;
});

$('dt a, nav a').hover(function(){
	that = $(this);
	changeColors();
},
function(){
	colorsBack();
});

//nav
$('nav a').click( function(event) {
	$.scrollTo(
		$(this).attr("href"),
		{
			duration: 600,
			offset: { 'top': -navSpace }
		}
	);
	return false;
});	
	
//back
$('a.triangle').click( function() {
	$(ddBox).slideUp();
	$.scrollTo('#haut', 800);
	$('dt a').removeClass('active');
	$(cadresId).removeClass().addClass('color1');
});	

/*$('.close').click( function() {
	$.scrollTo('.active', 400, {offset: {top:-heightSpace} });
	$(ddBox).slideUp(400);
	
	$('dt a').delay(600).removeClass('active');
	$(cadresId).removeClass().addClass('color1');
});*/	

//fullscreen
if (screenfull.enabled) {
	$(fsId).show();
}
$(fsId).click(function() {
	screenfull.toggle();
});

//lien haut header
/*
$(document).scroll(function(e) {
    if($(this).scrollTop() > $('header').height()) {
        $('.takemehigher').css("visibility", "visible");
    } else {
        $('.takemehigher').css("visibility", "hidden")
    }
});
*/
//banner
//setInterval("scrollBg()", scrollSpeed);

}); //end
