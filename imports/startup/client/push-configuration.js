Push.Configure({
  android: {
    senderID: Meteor.settings.public.gcm.projectNumber,
  },
  badge: true,
  sound: true,
  alert: true,
  vibrate: true,
  production: true,
});
