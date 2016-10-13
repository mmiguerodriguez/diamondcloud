// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.diamond.diamondcloud.development',
  name: 'Diamond Cloud Dev',
  description: 'Diamond Cloud Dev',
  author: 'Diamond',
  email: 'diamondclouddev@gmail.com',
  website: 'https://diamondcloud.tk'
});

// Set up resources such as icons and launch screens.
App.icons({
  // iOS
  'iphone_2x': 'public/img/logo.png', // 60x60
  'iphone_3x': 'public/img/logo.png', // 60x60
  'ipad': 'public/img/logo.png', // 76x76
  'ipad_2x': 'public/img/logo.png', // 76x76

  // Android
  // 'android_ldpi': 'resources/icons/icon-36x36.png',
  'android_mdpi': 'resources/icons/icon-48x48.png',
  'android_hdpi': 'resources/icons/icon-72x72.png',
  'android_xhdpi': 'resources/icons/icon-96x96.png',
  'android_xxhdpi': 'resources/icons/icon-144x144.png',
  'android_xxxhdpi': 'resources/icons/icon-192x192.png',
});

App.launchScreens({
  // iOS
  'iphone_2x': 'public/img/logo.png', // 320x480
  'iphone5': 'public/img/logo.png', // 320x568
  'iphone6': 'public/img/logo.png', // 375x667
  'iphone6p_portrait': 'public/img/logo.png', // 414x736
  'iphone6p_landscape': 'public/img/logo.png', // 736x414
  'ipad_portrait': 'public/img/logo.png', // 768x1024
  'ipad_portrait_2x': 'public/img/logo.png', // 768x1024
  'ipad_landscape': 'public/img/logo.png', // 1024x768
  'ipad_landscape_2x': 'public/img/logo.png', // 1024x768

  // Android
  // 'android_ldpi_portrait': 'resources/splash/splash-230x320.png',
  // 'android_ldpi_landscape': 'resources/splash/splash-320x230.png',
  'android_mdpi_portrait': 'resources/splash/splash-320x480.png',
  'android_mdpi_landscape': 'resources/splash/splash-480x320.png',
  'android_hdpi_portrait': 'resources/splash/splash-480x800.png',
  'android_hdpi_landscape': 'resources/splash/splash-800x480.png',
  'android_xhdpi_portrait': 'resources/splash/splash-720x1280.png',
  'android_xhdpi_landscape': 'resources/splash/splash-1280x720.png',
  'android_xxhdpi_portrait': 'resources/splash/splash-960x1600.png',
  'android_xxhdpi_landscape': 'resources/splash/splash-1600x960.png',
  // 'android_xxxhdpi_portrait': 'resources/splash/splash-1280x1920.png',
  // 'android_xxxhdpi_landscape': 'resources/splash/splash-1920x1280.png',
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xffffffff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');

// Fix CORS issues
App.accessRule('*');

App.configurePlugin('phonegap-plugin-push', {
  SENDER_ID: '624318008240',
});
