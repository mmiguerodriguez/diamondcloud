import { Meteor } from 'meteor/meteor';
import { Push }   from 'meteor/raix:push';

Push.Configure({
  gcm: {
    apiKey: Meteor.settings.private.gcm.apiKey,
  },
});
