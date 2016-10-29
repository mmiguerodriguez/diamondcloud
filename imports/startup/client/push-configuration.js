import { Meteor } from 'meteor/meteor';
import { Push }   from 'meteor/raix:push';

Push.Configure({
  android: {
    senderID: Meteor.settings.public.gcm.projectNumber,
  },
  icon: 'pushicon',
  iconColor: '#3498DB',
  badge: true,
  sound: true,
  alert: true,
  vibrate: true,
  production: true,
});
