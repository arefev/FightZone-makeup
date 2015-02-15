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
	runAnimationBlock($(".top-menu"));
	runAnimationBlock($(".header__bottom"));
	runAnimationSection($(".main-slider"));
	
	// HEADER LOGO
	$(".header-logo").hover(function(){
		$(this).removeClass("slideDown");
		$(this).find(".header-logo__item").addClass("slideDownShowFromTop");
	}, function(){
		$(this).find(".header-logo__item").removeClass("slideDownShowFromTop");
	});
	
	/* TOP MENU */
	var topMenu = $(".top-menu"),
		topMenuHidden = topMenu.clone(),
		topMenuTimeOut, topMenuTime = 300;
	
	topMenuHidden.removeClass(".animation-block")
		.find(".animation")
		.removeClass("animation");
		
	topMenuHidden.find(".top-menu__item-bg").remove();
	
	// top menu animation
	topMenu.find(".top-menu__item").hover(function(){
		var left = $(this).position().left + 22,
			width = $(this).width(),
			bg = topMenu.find(".top-menu__item-bg"),
			activeItem = topMenu.find(".top-menu__item.active");
			
		if (activeItem.length) {
			var activeLeft = activeItem.position().left + 22,
				activeWidth = activeItem.width();
				
			bg.css({
				left: activeLeft,
				width: activeWidth
			});
			
			activeItem.removeClass("active")
					  .addClass("noactive");
		}

		clearTimeout(topMenuTimeOut);	
		bg.stop();	
		
		bg.animate({
			left: left,
			width: width
		}, topMenuTime).show();
		
	}, function(){
		var bg = topMenu.find(".top-menu__item-bg"),
			activeItem = topMenu.find(".top-menu__item.noactive");
			
		clearTimeout(topMenuTimeOut);

		if (activeItem.length) {
			var activeLeft = activeItem.position().left + 22,
				activeWidth = activeItem.width();
			
			topMenuTimeOut = setTimeout(function(){
				bg.stop();
				bg.animate({
					left: activeLeft,
					width: activeWidth
				}, topMenuTime).show();
			}, topMenuTime);
		} else {
			topMenuTimeOut = setTimeout(function(){
				bg.hide();
			}, topMenuTime);
		}
	});
	
	
		
	$(".top-menu_hidden").prepend(topMenuHidden);
	
	$(".top-menu-icon, .top-menu__close").click(function(){
		if ($(".top-menu_hidden").is(":visible")) {
			var top = $(".main__inner").data("top");
			
			$(".top-menu_hidden").hide();
			$(".header__fixed").removeClass("header__fixed_margin");
			
			$(".main__inner")
				.removeClass("main__inner_fixed")
				.css("top", "auto");
				
			$("html, body").scrollTop(top);
			
		} else {
			var scrollTop = $(window).scrollTop();
			
			$(".main__inner")
				.addClass("main__inner_fixed")
				.css("top", -scrollTop)
				.data("top", scrollTop);
				
			$(".top-menu_hidden").show();
			$(".header__fixed").addClass("header__fixed_margin");
			$("html, body").scrollTop(0);
		}
	});
	/* --END-- TOP MENU */
	
	/*$(".index-section").each(function(){
		var minHeight = 766,
			windowHeight = $(window).height();
			
		if (windowHeight > minHeight) {
			$(this).height(windowHeight);
		}
	});*/
	
	/* FADE-IN SLIDER */
	$(".fade-in-slider__arrow").click(function(){
		var slider = $(this).closest(".fade-in-slider"),
			itemActive = slider.find(".fade-in-slider__item:visible"),
			itemNext = itemActive.next(".fade-in-slider__item");
		
		slider.stop();
		
		if (slider.is(".active")) {
			return false;
		}
		
		slider.addClass("active");
		itemActive.find(".animation, .animationRun, .animation-block")
				  .removeClass("animation animationRun animation-block slideLeft opacity rotate3DFadeIn");
		
		if (!itemNext.length) {
			itemNext = slider.find(".fade-in-slider__item").first();
		}	
		
		if ($(this).is(".fade-in-slider__arrow_left")) {
			itemNext = itemActive.prev(".fade-in-slider__item");
			if (!itemNext.length) {
				itemNext = slider.find(".fade-in-slider__item").last();
			}
		}
		
		itemActive.fadeOut();
		itemNext.fadeIn(function(){
			slider.removeClass("active");
		});
	});
	/* --END-- FADE-IN SLIDER */
	
	/* POPUP */
		$(".popup__close, #windowFill").click(function(){
			hidePopup($(this).closest(".popup"));
		});
	/* --END-- POPUP */
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
	
	$('.animationRun').each(function(){
        var imagePos = $(this).offset().top,
			animateName = $(this).data("animation-class"),
			timeStart = $(this).data("animation-timestart"),
			element = $(this);
 
		if (imagePos < topOfWindow) {
			if (!isNaN(timeStart)) {
				setTimeout(function(){
					element.addClass(animateName);
					
				}, timeStart);
			} else {
				$(this).addClass(animateName);
			}
		}
	});
});


$(window).resize(function(){
	centerPopup($(".popup"));
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
		element = $(".popup:visible");
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