$(document).ready(function() {

    $('iframe').each(function() {
      var url = $(this).attr("src");
      if ($(this).attr("src").indexOf("?") > 0) {
        $(this).attr({
          "src" : url + "&wmode=transparent",
          "wmode" : "Opaque"
        });
      }
      else {
        $(this).attr({
          "src" : url + "?wmode=transparent",
          "wmode" : "Opaque"
        });
      }
    });
	// Fancybox mailing list
	$('.fancybox').fancybox();

	// Breadcrumbs
	$('#breadcrumbs').remove().prependTo('#topbar');

	// Fitvids
	$('.tiny-mce').fitVids();

	// Listen Popup Window
	$('.listenpage').popupWindow({ 
		height:620, 
		width:498,
		top: 50,
		left: 50
	});
	
	// Lyrics
	$('.playlist td:has(.lyrics)').each(function() {
		$('<a class="show_lyrics">Lyrics</a>').appendTo($(this));
	});	
		
	$('.show_lyrics').click(function() {
		$(this).siblings('.lyrics').show();
	});
	
	// Fade out Lyrics
	$('.lyrics a.close').click(function() {
	  $('.lyrics').fadeOut('fast', function() {
	    // Animation complete.
	  });
	});

    // Mobile nav toggler
    $(".mobile-menu-toggler").on("click", function() {
        $(this).toggleClass("active");
        $(".mobile-nav-wrapper").toggleClass("active");
    });

    // Mobile subnav toggler
    $("#menu .parent > a").on("click", function(event) {
        var clicked = $(this).parent(".parent");
        // Handle toggling states
        if(clicked.hasClass("active")) {
            $("#header li.parent").removeClass("active");
        } else {
            $("#header li.parent").removeClass("active");
            clicked.addClass("active");
        }

        event.preventDefault();

    });

    var startSlideshow = function(){

        var slider       = $("#slideshow"),
            slides       = $();
		
		// Hide the topbar on the events page
		if (window.location.pathname == '/events') { $('#header #topbar').css('display', 'none'); }
		
		// Don't show the slider (the rest of this function) unless we're on the home
		if ( !$(document.body).hasClass('home') ) { return; }
		// Grab the slides, build a slideshow
            $.ajax({
                url:      "/api/json/features/HOME_SLIDESHOW",
                dataType: "json",
                success:  function(response) {
                    // No slides? No work
                    if ( response.length < 1 ) {
                        this.error();
                        return;
                    }
                    for ( var i = 0; i < response.length; i++ ) {
                        var slide,
                            single  = response[i],
                            has_url = (single.url && single.url !== ""),
                            image = $("<img>", {
                                "alt": single.title || "",
                                "src": single.source
                            });
                        // Bind load event to first image
                        if ( i < 1 ) {
                            image.on("load", function(){
                                slider.removeClass("loading").addClass("loaded");
                            });
                        }
                        // Wrap in anchor if has a custom url
                        if ( has_url ) {
                            image = $("<a>", { href: single.url, target: "_blank" }).append(image);
                        }
                        // Build the slide
                        slide = $("<li>").addClass("slide").append(image);
                        slides = slides.add(slide);
                    }
                    // Build slideshow
                    slides.appendTo(slider);
                    slider.wrapInner("<ul class='slides' />");
                    slider.flexslider({
                        pauseOnHover: true,
                        useCSS: true,
                        animation: "slide",
                        controlNav: false,
                        directionNav: true,
                        slideshowSpeed: 15000
                    });
                },
                error: function(error) {
                    slider.removeClass("loading");
                    return;
                }
            });

    };

	startSlideshow();

    // User profiles
    var win             = $(window),
        winWidth        = win.width(),
        winHeight       = win.height(),
        container       = $("#container"),
        aside           = $("#aside"),
        main            = $("#main"),
        memberInfo      = $(".member.info"),
        combineProfiles = false;

    // Move About and Profile together on small screens
    function combineProfile() {
        if (winWidth <= 960 && !combineProfiles) {
            memberInfo.prependTo(main);
            combineProfiles = true;
        } else if (winWidth >= 960 && combineProfiles) {
            memberInfo.prependTo(aside);
            combineProfiles = false;
        }
    }

    // Aside min-height
    function asideHeight() {
        if(aside.length) {
            container.css("min-height", aside.height());
        }
    }

    function winResized() {
        winWidth  = win.width();
        winHeight = win.height();
        combineProfile();
        asideHeight();
    }

    win.on("load resize", winResized);

});
