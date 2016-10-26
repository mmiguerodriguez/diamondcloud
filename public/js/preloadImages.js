/**
 * Preloads all the images
 */
 
[
  '/img/error-404.png',
  '/img/add-people-icon.svg',
  '/img/board-background-png.png',
  '/img/board-chat.svg',
  '/img/check-symbol.svg',
  '/img/close-icon.svg',
  '/img/cyd-landing-background.jpg',
  // '/img/dashboard.png',
  '/img/google-icon.png',
  '/img/logo-cyd.jpg',
  '/img/logo.ico',
  '/img/logo.png',
  '/img/logo.svg',
  '/img/menu-button.svg',
  '/img/search-people-icon.svg',
  '/img/search.svg',
  '/img/send-message-icon.svg',
  '/img/teamconfig.svg',
  '/img/trash.svg',
  '/img/user-shape.jpg',
  '/img/visibility-off.svg',
  '/img/visibility-on.svg',
  // chat icons
  '/img/chat/back-arrow.svg',
  '/img/chat/maximize.svg',
  // sidebar icons
  '/img/sidebar/boards.svg',
  '/img/sidebar/config.svg',
  '/img/sidebar/messages.svg',
  '/img/sidebar/modules.svg',
  '/img/sidebar/notification-badge.svg',
  '/img/sidebar/shop-cart.svg',
  '/img/sidebar/vertical-ellipsis.svg',
  // modules previews & icons
  '/modules/drive/image.png',
  '/modules/post-it/image.png',
  '/modules/task-manager/image.png',
  '/modules/videocall/image.png',
  '/modules/drive/preview.png',
  '/modules/post-it/preview.png',
  '/modules/task-manager/preview.png',
  '/modules/videocall/preview.png',
]
.forEach((src) => {
  new Image().src = src;
});
