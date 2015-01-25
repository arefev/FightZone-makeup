// MAIN JavaScript

var windowMaxWidth = 980;
var arCarousel3D = [];

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
	
	/* TOP MENU */
	var menu = $(".top-menu").clone();
	menu.removeClass(".animation-block")
		.find(".animation")
		.removeClass("animation");
		
	$(".top-menu_hidden").prepend(menu);
	
	$(".top-menu-icon, .top-menu__close").click(function(){
		if ($(".top-menu_hidden").is(":visible")) {
			var top = $(".main__inner").data("top"),	
				menu = $(".top-menu");
			
			$(".top-menu_hidden").hide();
			$(".header__fixed").removeClass("header__fixed_margin");
			
			$(".main__inner")
				.removeClass("main__inner_fixed")
				.css("top", "auto");
				
			$("html, body").scrollTop(top);
			
		} else {
			var scrollTop = $(window).scrollTop(),
				menu = $(".top-menu");
			
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
	
	/* 
	MAIN SLIDER
	отслеживаем события на клик стрелочек и пагинации
	*/
	$(".main-slider__arrow_right, .main-slider__arrow_left, .main-slider__nav__item").click(function(){
		if ($(this).is(".main-slider__nav__item_active")) {
			return false;
		}
	
		var textBlock = $(".main-slider__text:visible");
			
		if ($(this).is(".main-slider__arrow_right")) {
			var textBlockNext = textBlock.next(".main-slider__text");
			if (!textBlockNext.length) {
				textBlockNext = $(".main-slider__text").first();
			}
		} else if ($(this).is(".main-slider__arrow_left")) {
			var textBlockNext = textBlock.prev(".main-slider__text");
			if (!textBlockNext.length) {
				textBlockNext = $(".main-slider__text").last();
			}
		} else {
			var indexNext = $(this).index(),
				textBlockNext = $(".main-slider__text").eq(indexNext);
		}
		
		// смена изображений и переключние пагинации
		var index = textBlock.index(),
			indexNext = textBlockNext.index(),
			image = $(".main-slider__image").eq(index),
			imageNext = $(".main-slider__image").eq(indexNext),
			nav = $(".main-slider__nav__item").eq(index),
			navNext = $(".main-slider__nav__item").eq(indexNext);
		
		image.fadeOut();
		imageNext.fadeIn();
		
		// Если слайд содержит видео, прячем список тренировок и преимущества
		if (imageNext.is(".main-slider__image_video")) {
			$(".advantages, .main-slider__left").hide();
		} else {
			$(".advantages, .main-slider__left").show();
		}
		
		nav.removeClass("main-slider__nav__item_active");
		navNext.addClass("main-slider__nav__item_active");
		
		// управление анимацией текстовых блоков
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
	
	/*
	Расписание тренировок
	При наведении на оранжевую плашку в таблицу, нужно показывать информацию о тренере
	Необходимо рассчитать положение попапа с информацией: сверху, снизу, слева, справа.
	*/
	$(".schedule-table__item").hover(function(){
		showSchedulePopup($(this));
	}, function (){
		var popup = $(this).find(".schedule-table__info");
		popup.removeClass().addClass("schedule-table__info").hide();
	});
	
	$(".schedule-table__info__close").click(function(){
		var popup = $(this).closest(".schedule-table__info");
		popup.hide();
	});
	
	$(".schedule-table__item").click(function(e){
		if ($(e.target).is(".schedule-table__info__close")) {
			var popup = $(e.target).closest(".schedule-table__info");
			popup.hide();
		} else {
			showSchedulePopup($(this));
		}
	});
	
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
	
	
	/* SERVICES */
	$(".services-calc .hor-list__item:not(.hor-list__item_noactive)").click(function(){
		var parent = $(this).closest(".services-calc__item"),
			parentNext = parent.next(".services-calc__item"),
			activeItem = parent.find(".hor-list__item_active"),
			numNext = parentNext.find(".hor-list__item_num");
			
		if (parent.is(".services-calc__item_noactive")) {
			return false;
		}
		
		numNext.addClass("hor-list__item_num_active");
			
		parentNext.removeClass("services-calc__item_noactive");
			
		activeItem.removeClass("hor-list__item_active");
		$(this).addClass("hor-list__item_active");
	});
	/* --END-- SERVICES */
	
	
	$(".carousel-3d").each(function(index){
		var carousel = $(".carousel-3d").waterwheelCarousel({
			separation:320,
			separationMultiplier:0.3,
			opacityMultiplier:1
		});
		
		$(this).data("index", index);
		arCarousel3D.push(carousel);
	});
	
	$(".carousel-3d__arrow").click(function(){
		var parrentIndex = $(this).closest(".carousel-3d").data("index"),
			object = arCarousel3D[parrentIndex];
			
		if ($(this).is(".carousel-3d__arrow_left")) {
			object.prev();
		} else {
			object.next();
		}
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
	centerPopup($(".b-popup"));

	$(".carousel-3d").each(function(index){
		var object = arCarousel3D[index];
		
		object.reload({
			separation:320,
			separationMultiplier:0.3,
			opacityMultiplier:1
		});
	});
	
});

function showSchedulePopup(item) {
	var table = item.closest(".schedule-table"),
		td = item.closest("td"),
		itemTop = td.position().top,
		itemLeft = td.position().left,
		vertPos = "",
		horPos = "",
		popup = item.find(".schedule-table__info"),
		popupPosition = "",
		popupHeight = 198,
		popupWidth = 462,
		windowWidth = $(window).width();
		
	if (windowWidth < 480) {
		popup.show();
		
	} else {
		if (itemTop >= popupHeight) {
			vertPos = "top";
		} else {
			vertPos = "bottom";
		}
		
		if (itemLeft >= popupWidth) {
			horPos = "left";
		} else {
			horPos = "right";
		}
		
		popupPosition = horPos + "-" + vertPos;
		popup.addClass("schedule-table__info_" + popupPosition).show();
	}
}

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





$(function(){
	var rSections = $(".r-sections"),
		items = rSections.find(".r-sections__item"),
		sizeItems = items.size(),
		middleItemIndex = parseInt(sizeItems/2),
		middleItem = items[middleItemIndex],
		pointCoords = [[43, 65], [152, 38], [261, 11], [405, 0], [538, 11], [652, 38], [806, 65]],
		coordStartX = 385,
		coordStartY = 0,
		coordXPlus = 100,
		coordYPlus = 24,
		coordXPlusMiddle = 150,
		coordYPlusMiddel = 17;
		
	
	// SET RIGHT ITEMS
	var x = coordStartX, y = coordYPlus;
	for (var i = middleItemIndex; i < sizeItems; i++) {
		var item = $(items[i]);
		
		if (i == middleItemIndex) {
			item.addClass("center");
		}
		
		var arProp = rSectionsGetProp($(items[i+1]), "right");
		
		item.css({
			left: x,
			bottom: y,
			fontSize: arProp.fontSize,
			opacity: arProp.opacity
		});
		
		if (i == middleItemIndex) {
			x += coordXPlusMiddle;
			y += coordYPlusMiddel;
		} else {
			x += coordXPlus;
			y += coordYPlus;
		}
	}
	
	// SET LEFT ITEMS
	var x = coordStartX, y = coordYPlus;
	for (var i = middleItemIndex-1; i >= 0; i--) {
		var item = $(items[i]);
		
		if (i == middleItemIndex-1) {
			x -= coordXPlusMiddle;
			y += coordYPlusMiddel;
		} else {
			x -= coordXPlus;
			y += coordYPlus;
		}
		
		var arProp = rSectionsGetProp($(items[i+1]), "right");
		
		item.css({
			left: x,
			bottom: y,
			fontSize: arProp.fontSize,
			opacity: arProp.opacity
		});
	}

	
	// ITEM CLICK
	var clicked = false;
	$(".r-sections__item").click(function(){
		var circle = rSections.find(".r-sections__circle"),
			direction = "right";
			
		if ($(this).nextAll(".center").length) {
			direction = "left";
		}
		
		if (clicked) return false;
		
		clicked = true;
		
		items.each(function(index){
			var item = $(this),
				itemIndex = item.index(),
				x = item.position().left + coordXPlus,
				y,
				middleItemIndex = $(".r-sections__item.center").index();
				
			if (direction == "left") {
				var itemNext = $(items[index+1]);
				
				x = item.position().left + coordXPlus;
				y = parseFloat(item.css("bottom")) + coordYPlus;
			} else {
				var itemNext = $(items[index-1]);
				
				x = item.position().left - coordXPlus;
				y = parseFloat(item.css("bottom")) + coordYPlus;
			}			
			
			if (itemNext.length) {
				x = parseFloat(itemNext.css("left"));
				y = parseFloat(itemNext.css("bottom"));
			}
			
			var arProp = rSectionsGetProp(item, direction);
			
			item.animate({
				left: x,
				bottom: y,
				fontSize: arProp.fontSize,
				opacity: arProp.opacity
			}, 500, function(){
				if (item.index() == sizeItems-1) {
					var middleItem = $(".r-sections__item.center"),
						nextMiddleItem;
						
					if (direction == "left") {
						nextMiddleItem = middleItem.prev(".r-sections__item");
						
						var firstItem = $(".r-sections__item").first(),
							x = firstItem.position().left - coordXPlus,
							y = parseFloat(firstItem.css("bottom")) + coordYPlus;
							
						
						item.prependTo($(".r-sections__circle")).css({
							left: x,
							bottom: y
						});
					
					} else {
						nextMiddleItem = middleItem.next(".r-sections__item");
						
						var lastItem = $(".r-sections__item").last(),
							x = lastItem.position().left + coordXPlus,
							y = parseFloat(lastItem.css("bottom")) + coordYPlus;
							
						items.first().appendTo($(".r-sections__circle")).css({
							left: x,
							bottom: y
						});
					}
					
					middleItem.removeClass("center");
					nextMiddleItem.addClass("center");
					
					items = rSections.find(".r-sections__item");
					
					clicked = false;
				}
			});
			
		});
	});
	
	function rSectionsGetProp (item, direction) {
		var itemIndex = item.index(),
			middleItemIndex = $(".r-sections__item.center").index(),
			fontSize = fontSizeMin,
			fontSizeMax = 24,
			fontSizeMin = 14,
			fontSizeMiddle = 18,
			opacityMin = 0.5,
			opacityMiddle = 0.8,
			opacityMax = 1,
			itemOpacity = opacityMin;
			
		if (direction == "left") {
			// FONT SIZE
			if (middleItemIndex - itemIndex == 2) {
				fontSize = fontSizeMiddle;
				itemOpacity = opacityMiddle;
			} else if (middleItemIndex - itemIndex == 1) {
				fontSize = fontSizeMax;
				itemOpacity = opacityMax;
			} else if (item.is(".center")) {
				fontSize = fontSizeMiddle;
				itemOpacity = opacityMiddle;
			} else {
				fontSize = fontSizeMin;
				itemOpacity = opacityMin;
			}
		} else {
			// FONT SIZE
			if (itemIndex - middleItemIndex == 2) {
				fontSize = fontSizeMiddle;
				itemOpacity = opacityMiddle;
			} else if (itemIndex - middleItemIndex == 1) {
				fontSize = fontSizeMax;
				itemOpacity = opacityMax;
			} else if (item.is(".center")) {
				fontSize = fontSizeMiddle;
				itemOpacity = opacityMiddle;
			} else {
				fontSize = fontSizeMin;
				itemOpacity = opacityMin;
			}
		}
		
		return {"opacity": itemOpacity, "fontSize": fontSize}; 
	}

});