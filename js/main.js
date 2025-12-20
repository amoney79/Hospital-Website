jQuery(function ($) {

  "use strict";

  // loader
  var loader = function () {
    setTimeout(function () {
      if ($('#probootstrap-loader').length > 0) {
        $('#probootstrap-loader').removeClass('show');
      }
    }, 1);
  };
  loader();

  var carousel = function () {
    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      stagePadding: 5,
      nav: false,
      navText: ['<span class="icon-chevron-left">', '<span class="icon-chevron-right">'],
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1000: {
          items: 3
        }
      }
    });
  };
  carousel();


  var counter = function () {

    $('#section-counter').waypoint(function (direction) {

      if (direction === 'down' && !$(this.element).hasClass('probootstrap-animated')) {

        var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
        $('.probootstrap-number').each(function () {
          var $this = $(this),
            num = $this.data('number');
          console.log(num);
          $this.animateNumber(
            {
              number: num,
              numberStep: comma_separator_number_step
            }, 7000
          );
        });

      }

    }, { offset: '95%' });

  }
  counter();



  var contentWayPoint = function () {
    var i = 0;
    $('.probootstrap-animate').waypoint(function (direction) {

      if (direction === 'down' && !$(this.element).hasClass('probootstrap-animated')) {

        i++;

        $(this.element).addClass('item-animate');
        setTimeout(function () {

          $('body .probootstrap-animate.item-animate').each(function (k) {
            var el = $(this);
            setTimeout(function () {
              var effect = el.data('animate-effect');
              if (effect === 'fadeIn') {
                el.addClass('fadeIn probootstrap-animated');
              } else if (effect === 'fadeInLeft') {
                el.addClass('fadeInLeft probootstrap-animated');
              } else if (effect === 'fadeInRight') {
                el.addClass('fadeInRight probootstrap-animated');
              } else {
                el.addClass('fadeInUp probootstrap-animated');
              }
              el.removeClass('item-animate');
            }, k * 50, 'easeInOutExpo');
          });

        }, 100);

      }

    }, { offset: '95%' });
  };
  contentWayPoint();

  var datePicker = function () {
    $('#probootstrap-date').datepicker({
      'format': 'm/d/yyyy',
      'autoclose': true
    });
  };
  datePicker();

  var hiResImg = function () {
    if (window.devicePixelRatio == 2) {
      var images = $("img.hires");

      // loop through the images and make them hi-res
      for (var i = 0; i < images.length; i++) {
        // create new image name
        var imageType = images[i].src.substr(-4);
        var imageName = images[i].src.substr(0, images[i].src.length - 4);
        imageName += "@3x" + imageType;

        //rename image
        images[i].src = imageName;
      }
    }
  };
  hiResImg();

  /* ---------------------------------------------
* Departments – Change center image on tab click
* --------------------------------------------- */
  (function () {
    var $deptImage = $('#dept-image');

    if (!$deptImage.length) return; // safety check

    $('#dept-tab .nav-link').on('shown.bs.tab click', function () {
      var imageSrc = $(this).data('image');

      if (imageSrc) {
        // Optional smooth fade effect
        $deptImage.stop(true, true).fadeOut(150, function () {
          $deptImage.attr('src', imageSrc).fadeIn(150);
        });
      }
    });
  })();


  // Testimonials: smooth continuous slider (RTL-safe)
  (function () {
    var $owl = $('.testimonials-carousel');
    if (!$owl.length || !$.fn.owlCarousel) return;

    $owl.owlCarousel({
      loop: true,
      margin: 24,

      autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,

      smartSpeed: 1200,      // smooth slide animation
      slideTransition: 'ease-in-out',

      dots: true,
      nav: true,
      navText: [
        '<span class="icon-chevron-left"></span>',
        '<span class="icon-chevron-right"></span>'
      ],

      rtl: true,

      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
      }
    });
  })();



  // ----- Gallery (Isotope) + Lightbox init -----
  (function () {
    // run only if gallery present
    if ($('.gallery-grid').length) {
      // safe checks
      var initIsotope = function () {
        try {
          var grid = document.querySelector('.gallery-grid');
          var iso = new Isotope(grid, {
            itemSelector: '.gallery-item',
            layoutMode: 'masonry',
            masonry: {
              columnWidth: '.gallery-item',
              percentPosition: true
            }
          });

          // relayout after each image loads (best effort)
          var imgs = grid.querySelectorAll('img');
          var loadedCount = 0;
          if (imgs.length === 0) {
            iso.layout();
          } else {
            imgs.forEach(function (img) {
              if (img.complete) {
                loadedCount++;
                if (loadedCount === imgs.length) iso.layout();
              } else {
                img.addEventListener('load', function () {
                  loadedCount++;
                  iso.layout();
                });
                img.addEventListener('error', function () {
                  loadedCount++;
                  iso.layout();
                });
              }
            });
          }

          // filter buttons
          $('.gallery-filter-btn').on('click', function (e) {
            e.preventDefault();
            var $btn = $(this);
            $('.gallery-filter-btn').removeClass('active');
            $btn.addClass('active');
            var filter = $btn.attr('data-filter') || '*';
            iso.arrange({ filter: filter });
          });
        } catch (err) {
          console.warn('Isotope init failed:', err);
        }
      };

      // try to init Isotope (if library loaded)
      if (typeof Isotope !== 'undefined') {
        initIsotope();
      } else {
        console.warn('Isotope not loaded, gallery layout disabled.');
      }
    }

    // Lightbox options (if Lightbox2 present)
    if (typeof lightbox !== 'undefined') {
      lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'alwaysShowNavOnTouchDevices': true,
        'albumLabel': 'Image %1 of %2',
        'fadeDuration': 300
      });
    }
  })();

  // ----- Donation interactions (if donation UI present) -----
  (function () {
    if (!$('.donation-card').length && !$('.donation-heart-btn').length) return;

    // toggle aria state on heart button for accessibility
    $(document).on('click', '.donation-heart-btn', function () {
      var $btn = $(this);
      var target = $btn.attr('data-target') || $btn.data('target') || '#donation-form';
      var $target = $(target);
      // Bootstrap collapse will handle show/hide; keep aria-consistent
      setTimeout(function () {
        var expanded = $target.hasClass('show');
        $btn.attr('aria-expanded', expanded);
      }, 50);
    });

    // donation amount quick-select buttons
    $(document).on('click', '.donation-amount', function (e) {
      e.preventDefault();
      var $btn = $(this);
      var amount = $btn.data('amount') || '';
      $('.donation-amount').removeClass('active');
      $btn.addClass('active');
      $('#custom-amount').val(''); // clear custom
      $('#donation-amount-input').val(amount);
    });

    // custom amount input updates hidden field and removes active from presets
    $(document).on('input', '#custom-amount', function () {
      var val = $(this).val();
      $('.donation-amount').removeClass('active');
      $('#donation-amount-input').val(val || '');
    });

    // ensure a donation amount is set before submit (client-side)
    $(document).on('submit', '.donation-form', function (e) {
      var amount = $('#donation-amount-input').val();
      if (!amount || Number(amount) <= 0) {
        e.preventDefault();
        alert('Please choose or enter a donation amount.');
        $('#custom-amount').focus();
        return false;
      }
      return true;
    });
  })();

  // Auto-collapse history panel after it is opened (8 seconds)
  (function () {
    var AUTO_COLLAPSE_MS = 8000; // milliseconds to wait before auto-collapse
    var timerKey = 'historyAutoCollapseTimer';

    // when the collapse finishes showing, start timer to auto-hide
    $(document).on('shown.bs.collapse', '#historyCollapse', function () {
      var $panel = $(this);

      // clear any existing timer
      var existing = $panel.data(timerKey);
      if (existing) {
        clearTimeout(existing);
      }

      // scroll into view a little for better UX
      setTimeout(function () {
        $('html, body').animate({ scrollTop: $panel.offset().top - 80 }, 350);
      }, 80);

      // set auto-collapse timer
      var t = setTimeout(function () {
        $panel.collapse('hide');
      }, AUTO_COLLAPSE_MS);

      $panel.data(timerKey, t);
    });

    // clear timer if user hides manually
    $(document).on('hide.bs.collapse', '#historyCollapse', function () {
      var $panel = $(this);
      var t = $panel.data(timerKey);
      if (t) {
        clearTimeout(t);
        $panel.removeData(timerKey);
      }
    });

    // optional: when user clicks the "View History" button multiple times reset timer
    $(document).on('click', '#historyToggle', function () {
      var $panel = $('#historyCollapse');
      // if panel already shown, reset timer
      if ($panel.hasClass('show')) {
        $panel.trigger('shown.bs.collapse');
      }
    });
  })();

  // ----- Form Submission Handlers -----
  (function () {
    // Appointment Forms
    $(document).on('submit', '.probootstrap-form-appointment, #appointment-form-side', function (e) {
      e.preventDefault();
      var $form = $(this);
      var formData = $form.serializeArray();
      var dataObj = {};
      formData.forEach(function (item) {
        dataObj[item.name] = item.value;
      });

      // Simulation of email sending
      console.log('Form submitted:', dataObj);

      // Construct mailto link for "send email message" part of request
      var subject = encodeURIComponent('New Appointment Request from ' + dataObj.first_name + ' ' + dataObj.last_name);
      var body = encodeURIComponent(
        'New Appointment Request:\n\n' +
        'Name: ' + dataObj.first_name + ' ' + dataObj.last_name + '\n' +
        'Service: ' + (dataObj.service || 'Not specified') + '\n' +
        'Phone: ' + (dataObj.phone || 'Not specified') + '\n' +
        'Date/Time: ' + (dataObj.date || 'Not set') + ' at ' + (dataObj.time || 'Not set') + '\n' +
        'Message: ' + (dataObj.message || 'No message')
      );

      // We show success alert first
      alert('Thank you! Your appointment request has been received. Redirecting to your email client to send the details.');

      window.location.href = "mailto:marafikicommunityhospital@gmail.com?subject=" + subject + "&body=" + body;

      $form[0].reset();
    });

    // Contact Forms
    $(document).on('submit', '.probootstrap-form', function (e) {
      if ($(this).hasClass('probootstrap-form-appointment')) return; // handled above

      e.preventDefault();
      var $form = $(this);
      alert('Thank you for your message! We will get back to you shortly.');
      $form[0].reset();
    });
  })();

});

