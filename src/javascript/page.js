var $ = require('jquery');
var scrollReveal = require('scrollreveal');
var remodal = require('remodal');
var nav = $('.top');
var fleche = $('#fleche-top');

window.sr = new scrollReveal();

			$(document).ready(function(){

				$('.email').on('click', 'a', function(e){
					$('form-email').style.display = "block";
					});

				$('.more').on('click', 'span', function(e){
					$(e.delegateTarget).toggleClass('active');
					});

					$('a[href^="#"]').click(function(){
		 				    var id = $(this).attr("href");
		 				    var offset = $(id).offset().top;
								$('html, body').animate({scrollTop: offset }, 'slow');
								return false;
		 				});

		});


		$(document).scroll(function () {

					if ($(this).scrollTop() > 20) {
							nav.addClass("scroll-nav");
							fleche.addClass("active");
				 }
				else {
							nav.removeClass("scroll-nav");
							fleche.removeClass("active");
					}
			});


			// $(document).on('scroll', function() {

			// 	var target = $("#target-skill");
			// 	var id = $(target).attr("href");
			// 	var offset = $(id).offset().top;

			//     if ( $(document).scrollTop() > offset)
			//          $('#onglet-skill').addClass("active");
			// 			 		else {
			//          $('#onglet-skill').removeClass("active");
			//      }
			// });

			// var anchor_offset = $('a[href="#target-skill"]').offset().top;

			// $(window).on('scroll', function() {
			//     if ( $(window).scrollTop() > anchor_offset )
			//          $('#onglet-skill').addClass("active");
			// 			 		else {
			//          $('#onglet-skill').removeClass("active");
			//      }
			// });

// Contact Form

		var myForm = document.getElementById("myForm");
		var formAlert = document.getElementById("form-messages");
		var formData = $(myForm).serialize();
    $.ajax({
				url: $(form).attr('action'),
        cache: false,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (dataofconfirm) {
            // do something with the result
        }
    });

		$(form).submit(function(event) {
			event.preventDefault();
}
