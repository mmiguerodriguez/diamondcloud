/*
 * Bootstrap js popover fix so it can render react elements
 * http://jsfiddle.net/spicyj/q6hj7/
 * http://stackoverflow.com/questions/20033522/rendering-a-react-component-inside-a-bootstrap-popover
 */
import ReactDOM from 'react-dom';
import isMobile from 'ismobilejs';

// Extend only if jQuery object exists and $.n (jquery functions) is an object
if (!isMobile.any) {
  $.extend($.fn.popover.Constructor.DEFAULTS, {
    react: false
  });

  const oldSetContent = $.fn.popover.Constructor.prototype.setContent;
  $.fn.popover.Constructor.prototype.setContent = function () {
    if (!this.options.react) {
      return oldSetContent.call(this);
    }

    const $tip = this.tip();
    const title = this.getTitle();
    const content = this.getContent();

    $tip.removeClass('fade top bottom left right in');

    // If we've already rendered, there's no need to render again
    if (!$tip.find('.popover-content').html()) {
      // Render title, if any
      const $title = $tip.find('.popover-title');
      if (title) {
        ReactDOM.render(title, $title[0]);
      } else {
        $title.hide();
      }
      ReactDOM.render(content,  $tip.find('.popover-content')[0]);
    }
  };
}
