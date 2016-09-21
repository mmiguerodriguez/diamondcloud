Push.Configure({
  android: {
    senderID: Meteor.settings.public.gcm.projectNumber,
  },
  gcm: {
    image: 'diamondcloud.tk/img/logo.png',
  },
  badge: true,
  sound: true,
  alert: true,
  vibrate: true,
  production: true,
});
