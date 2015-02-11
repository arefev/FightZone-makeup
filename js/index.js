// INDEX PAGE

var arCarousel3D = [];


$(function(){
	/* 
	MAIN SLIDER
	отслеживаем события на клик стрелочек и пагинации
	*/
	$(".main-slider__text").each(function(index){
		var active = '';
		if (index <= 0) {
			active = ' main-slider__nav__item_active';
		}
		$(".main-slider__nav").append('<span class="main-slider__nav__item' + active + '"></span>');
	});
	
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
	
	/* PHOTO-VIDEO */
	/* sections */
	rSectionsInit();
	// item click
	var clicked = false;
	$(".r-sections__item").click(function(){
		var rSections = $(".r-sections"),
			items = rSections.find(".r-sections__item"),
			sizeItems = items.size(),
			middleItemIndex = parseInt(sizeItems/2),
			coordStartX = 385,
			coordStartY = 0,
			coordXPlus = 100,
			coordYPlus = 24,
			coordXPlusMiddle = 150,
			coordYPlusMiddel = 17,
			windowWidth = $(window).width();
			
		var circle = rSections.find(".r-sections__circle"),
			direction = "right";
			
		if ($(this).nextAll(".center").length) {
			direction = "left";
		}
		
		if (clicked || $(this).is(".center")) {
			return false;
		}
		
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
	
	/* carousel */
	$(".carousel-3d").each(function(index){
		var carousel = $(this).waterwheelCarousel(get3DCarouselOpt());
		
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
	
	$(".carousel-3d__link").colorbox({
		className: "carousel-3d-colorbox",
		innerWidth:"60%", 
		innerHeight:"60%",
		maxWidth: 980,
		current: '<a href="" class="colorbox__signup-training anim-fill-orange font-bold">Записаться на тренировку</a>',
		onComplete: function(e){
			var element = $("#colorbox"),
				width = element.width(),
				windowWidth = $(window).width(),
				left = (windowWidth - width)/2;
				
			element.css("left", left)
		}
	});
	
	$(".blog__item__link").colorbox({
		inline:true,
		className: "carousel-3d-colorbox",
		innerWidth:"70%", 
		innerHeight:"100%",
		maxHeight:516,
		maxWidth: 980,
		title:false,
		current: '<a href="" class="colorbox__signup-training anim-fill-orange font-bold">Записаться на тренировку</a>',
		onComplete: function(e){
			var element = $("#colorbox"),
				width = element.width(),
				windowWidth = $(window).width(),
				left = (windowWidth - width)/2;
				
			element.css("left", left)
		}
	});
	/* --END-- PHOTO-VIDEO */
});

$(window).resize(function(){

	/* PHOTO-VIDEO */
	/* sections */
	rSectionsInit();
	
	/* carousel */
	$(".carousel-3d .carousel-3d__item").stop();
	$(".carousel-3d").each(function(index){
		var object = arCarousel3D[index];
		
		object.reload(get3DCarouselOpt());
	});
	/* --END-- PHOTO-VIDEO */
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

function set3DCarouselArrows() {
	var windowWidth = $(window).width();
	
	$(".carousel-3d").each(function(index){
		var itemCenter = $(this).find(".carousel-center"),
			itemCenterWidth = itemCenter.width() + 6,
			itemCenterLeft = parseFloat(itemCenter.css("left")),
			leftArrow = $(this).find(".carousel-3d__arrow_left"),
			rightArrow = $(this).find(".carousel-3d__arrow_right"),
			arrowWidth = leftArrow.width(),
			margin = 20,
			leftArrowLeft = itemCenterLeft - margin - arrowWidth,
			rightArrowRight = itemCenterLeft + itemCenterWidth + margin;
		
		if (windowWidth < 480) {
			leftArrowLeft = 0;
			rightArrowRight = 0;
			
			leftArrow.css("left", leftArrowLeft);
			rightArrow.css("right", rightArrowRight);
		} else {
			leftArrow.css("left", leftArrowLeft);
			rightArrow.css("left", rightArrowRight);
		}
	});
}

function get3DCarouselOpt() {
	var windowWidth = $(window).width();
	
	/* PHOTO-VIDEO */
	/* carousel */
	var carouselOpt = {
		separation: 320,
		separationMultiplier: 0.3,
		opacityMultiplier: 1,
		flankingItems: 2,
		initCenterItem: set3DCarouselArrows,
		clickedCenter: function($clickedItem){
			//var src = $clickedItem.attr("src");
			//$.colorbox({html:'<img src="' + src + '" alt=""/>'});
		}
	};
	
	if (windowWidth < 480) {
		carouselOpt.flankingItems = 0;
	}
	
	return carouselOpt;
}


function rSectionsInit() {
	var rSections = $(".r-sections"),
		items = rSections.find(".r-sections__item"),
		sizeItems = items.size(),
		middleItemIndex = parseInt(sizeItems/2),
		coordStartX = 385,
		coordStartY = 0,
		coordXPlus = 100,
		coordYPlus = 24,
		coordXPlusMiddle = 150,
		coordYPlusMiddel = 17,
		windowWidth = $(window).width();
	
	if (windowWidth < 480) {
		coordXPlus = 100;
		coordXPlusMiddle = 100;
	}
	
	rSections.find(".r-sections__item.center").removeClass("center");
	

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
}

function rSectionsGetProp(item, direction) {
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
		}
	}
	
	return {"opacity": itemOpacity, "fontSize": fontSize}; 
}