(function() {
  var formSubscribe, loadApplication, photoSection, svgInjector, worksFilter;

  loadApplication = function() {
    var styles;
    styles = [
      "background: #7b77c9",
      "color: white",
      "display: block",
      "padding: 20px 20px 20px 20px",
      "text-align: center",
      "font-weight: normal",
      "font-size: 20px",
      "line-height: 60px"
    ].join(";");
    console.log('%c Lithium Loaded :)', styles, 'For usage visit: https://github.com/owldesign/3.-Lithium');

    $(svgInjector);
    $(worksFilter);
    $(photoSection);
    $(formSubscribe);

    $('.arrow-down').on('click', function(e) {
      e.preventDefault();
      $("html,body").animate({
        scrollTop: $("#page-work").offset().top
      });
    });

    if (window.Modernizr && Modernizr.touch && window.FastClick) {
      FastClick.attach(document.body);
    }
  };

  svgInjector = function() {
    if (typeof SVGInjector !== 'function') return;
    var mySVGsToInject = document.querySelectorAll('img.inject-me');
    SVGInjector(mySVGsToInject);
  };

  // === CORRIGIDO ===
  worksFilter = function() {
    var $filter = $('#work-filter');
    var $container = $('.article-list'); // UL que contém diretamente os LIs
    var $btns = $filter.find('.filter-link');
    var $mobileFilterBtn = $('.mobile-filter-select');

    // Inicializa Shuffle no container correto
    if (typeof $.fn.shuffle === 'function' && $container.length) {
      // Se quiser sizer, crie <li class="shuffle__sizer"></li> dentro da UL e descomente:
      // var $sizer = $container.find('.shuffle__sizer');
      $container.shuffle({
        itemSelector: '.work-item'
        // , sizer: $sizer
      });
    }

    // Toggle do filtro mobile (se existir)
    $mobileFilterBtn.on('click', function(e) {
      e.preventDefault();
      $filter.slideToggle();
      $(this).toggleClass('opened');
    });

    $(window).on('resize', function() {
      if ($(window).width() > 768) {
        if (!$filter.is(':visible')) $filter.slideDown();
      } else {
        $filter.slideUp();
        $mobileFilterBtn.removeClass('opened');
      }
    });

    // Clique nos itens: só usa data-url se o clique NÃO foi no <a> e houver URL válida
    $('.work-item').off('click').on('click', function(e) {
      var $targetLink = $(e.target).closest('a');
      if ($targetLink.length) return; // deixa o <a> navegar
      var url = $(this).data('url');
      if (url && url !== '#') {
        window.location.href = url;
      }
    });

    // Filtro por grupo
    $btns.on('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      if ($this.hasClass('active')) return false;

      $btns.removeClass('active');
      $this.addClass('active');

      var group = $this.data('group') || 'all';

      // Shuffle aceita 'all' e nomes de grupos. Os LIs têm data-groups='["..."]'.
      if (typeof $.fn.shuffle === 'function' && $container.length) {
        $container.shuffle('shuffle', group);
      } else {
        // Fallback simples sem Shuffle (mostra/esconde por classe)
        $('.work-item').each(function() {
          var groups;
          try {
            groups = JSON.parse($(this).attr('data-groups') || '[]');
          } catch (err) {
            groups = [];
          }
          var matches = group === 'all' || groups.indexOf(group) !== -1;
          $(this).toggle(matches);
        });
      }
    });

    // Estado inicial
    $btns.filter('[data-group="all"]').first().addClass('active');
    if (typeof $.fn.shuffle === 'function' && $container.length) {
      $container.shuffle('shuffle', 'all');
    } else {
      // Fallback
      $('.work-item').show();
    }
  };

  formSubscribe = function() {
    var form = $('#subscribe');
    var formMessages = $('.form-result');

    var hasHtml5Validation = function() {
      return typeof document.createElement("input").checkValidity === "function";
    };

    if (!form.length) return;

    if (hasHtml5Validation()) {
      form.on('submit', function(e) {
        if (!this.checkValidity()) {
          e.preventDefault();
          $(this).addClass("invalid");
          $("#status").html("invalid");
          return;
        }

        e.preventDefault();
        $(this).removeClass("invalid");

        var formData = form.serialize();

        $.ajax({
          type: "POST",
          url: form.attr("action"),
          data: formData
        }).done(function() {
          formMessages.removeClass("error").addClass("success")
            .text('You have successfully subscribed!');
          $("#email").val("");
        }).fail(function(data) {
          formMessages.removeClass("success").addClass("error")
            .text(data && data.responseText ? data.responseText
                 : "Oops! An error occured please check your email address.");
        });
      });
    }
  };

  photoSection = function() {
    var $photoItem = $('.photo-item');
    $photoItem.on('click', function(e) {
      var $targetLink = $(e.target).closest('a');
      if ($targetLink.length) return; // respeita o <a>
      var url = $(this).data('url');
      if (url && url !== '#') {
        window.location.href = url;
      }
    });
  };

  $(loadApplication);
}).call(this);
