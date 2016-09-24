var openFABMenu = function (btn) {
  let $this = btn;
  if ($this.hasClass('active') === false) {

    // Get direction option
    var horizontal = $this.hasClass('horizontal');
    var offsetY, offsetX;

    if (horizontal === true) {
      offsetX = 40;
    } else {
      offsetY = 40;
    }

    $this.addClass('active');
    $this.find('ul .btn-floating').velocity(
      { scaleY: ".4", scaleX: ".4", translateY: offsetY + 'px', translateX: offsetX + 'px'},
      { duration: 0 });

    var time = 0;
    $this.find('ul .btn-floating').reverse().each( function () {
      $(this).velocity(
        { opacity: "1", scaleX: "1", scaleY: "1", translateY: "0", translateX: '0'},
        { duration: 80, delay: time });
      time += 40;
    });
  }
};
var closeFABMenu = function (btn) {
  let $this = btn;
  // Get direction option
  var horizontal = $this.hasClass('horizontal');
  var offsetY, offsetX;

  if (horizontal === true) {
    offsetX = 40;
  } else {
    offsetY = 40;
  }

  $this.removeClass('active');
  var time = 0;
  $this.find('ul .btn-floating').velocity("stop", true);
  $this.find('ul .btn-floating').velocity(
    { opacity: "0", scaleX: ".4", scaleY: ".4", translateY: offsetY + 'px', translateX: offsetX + 'px'},
    { duration: 80 }
  );
};

$(document).on('click.fixedActionBtn', '.fixed-action-btn.click-to-toggle > a', function(e) {
  let $this = $(this);
  let $menu = $this.parent();
  
  if($menu.hasClass('active')) {
    closeFABMenu($menu);
  } else {
    openFABMenu($menu);
  }
});
