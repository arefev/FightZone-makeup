// MAIN JavaScript

function runAnimationSection(section) {
	section.find(".animation-block").each(function(){
		runAnimationBlock($(this));
	});
	
}

function runAnimationBlock(animationBlock) {
	var animationTimeOut = parseInt(animationBlock.data("animation-timestart")),
		animationTimePlus = 100;
		
	if (isNaN(animationTimeOut))
		animationTimeOut = 0;
	
	var animationClass = animationBlock.data("animation-class");
	
	animationBlock.find(".animation").each(function(index){
		var element = $(this);
		
		setTimeout(function(){
			element.addClass(animationClass);
		}, animationTimeOut);
		
		animationTimeOut = animationTimeOut + animationTimePlus;
	});
}

$(function(){
	runAnimationSection($(".header"));
	runAnimationSection($(".main-slider"));
	
	$(".main-slider__arrow_right, .main-slider__arrow_left").click(function(){
		var textBlock = $(".main-slider__text:visible");
			
			
		if ($(this).is(".main-slider__arrow_right")) {
			var textBlockNext = textBlock.next(".main-slider__text");
			if (!textBlockNext.length) {
				textBlockNext = $(".main-slider__text").first();
			}
		} else {
			var textBlockNext = textBlock.prev(".main-slider__text");
			if (!textBlockNext.length) {
				textBlockNext = $(".main-slider__text").last();
			}
		}
			
		textBlock.data({
			"animation-class": "slideRightFadeOut",
			"animation-timestart": 0
		});
		
		textBlockNext.data({
			"animation-class": "slideLeft",
			"animation-timestart": 0
		});
		
		textBlock.find(".animation").removeClass("slideRightFadeOut");
		textBlockNext.find(".animation").removeClass("slideRightFadeOut slideLeft");
		
		
		var size = Math.abs(textBlock.find(".animation").size() - 2),
			timeOut = 300 * size;
	
		runAnimationBlock(textBlock);
		setTimeout(function(){
			textBlock.hide();
			textBlockNext.show();
			runAnimationBlock(textBlockNext);
			
		}, timeOut);
		
	});
});


$(window).scroll(function() {
	// ANIMATATE
	var windowHeight = $(window).height();
	var topOfWindow = $(window).scrollTop() + windowHeight;
    $('.animation-block').each(function(){
        var imagePos = $(this).offset().top;
		if (imagePos <= topOfWindow) {
			runAnimationBlock($(this));
		}
	});
});


$(window).resize(function(){
	centerPopup($(".b-popup"));
	
});

function showPopup(element)
{
	element.show();
	$("#windowFill").show();
	
	centerPopup(element);
}

function hidePopup(element)
{
	if (!element.length)
	{
		element = $(".b-popup:visible");
	}
	
	element.hide();
	$("#windowFill").hide();
}

function centerPopup(element)
{
	var elWidth = element.width();
	var elHeight = element.height();
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var scrollTop = $(window).scrollTop();
	var left = windowWidth/2 - elWidth/2;
	var top = windowHeight/2 - elHeight/2 + scrollTop;
	
	if (left < 0) left = 0;
	if (top < 0) top = 0;
	
	element.css({
		left:left,
		top:top
	});
}