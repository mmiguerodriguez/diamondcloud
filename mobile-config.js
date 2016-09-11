// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.diamond.diamondcloud',
  name: 'Diamond Cloud',
  description: 'Diamond Cloud',
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
  'android_mdpi': 'public/img/logo.png', // 48x48
  'android_hdpi': 'public/img/logo.png', // 72x72
  'android_xhdpi': 'public/img/logo.png' // 96x96
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
  'android_mdpi_portrait': 'public/img/logo.png', // 320x480
  'android_mdpi_landscape': 'public/img/logo.png', // 480x320
  'android_hdpi_portrait': 'public/img/logo.png', // 480x800
  'android_hdpi_landscape': 'public/img/logo.png', // 800x480
  'android_xhdpi_portrait': 'public/img/logo.png', // 720x1280
  'android_xhdpi_landscape': 'public/img/logo.png' // 1280x720
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xffffffff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');

// Fix CORS issues
App.accessRule('*');
