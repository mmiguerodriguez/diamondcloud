import { Meteor }               from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

ServiceConfiguration.configurations.upsert({ service: 'google' }, {
  $set: {
    clientId: Meteor.settings.private.oAuth.google.clientId,
    secret: Meteor.settings.private.oAuth.google.secret,
    loginStyle: 'redirect',
  },
});
