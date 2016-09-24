Push.Configure({
  android: {
    senderID: Meteor.settings.public.gcm.projectNumber,
  },
  iconColor: "#3498DB",
  badge: true,
  sound: true,
  alert: true,
  vibrate: true,
  production: true,
});
