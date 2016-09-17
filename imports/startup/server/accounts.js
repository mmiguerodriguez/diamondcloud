ServiceConfiguration.configurations.upsert({ service: 'google' }, {
  $set: {
    clientId: Meteor.settings.private.oAuth.google.clientId,
    secret: Meteor.settings.private.oAuth.google.secret,
    loginStyle: 'redirect',
  }
});
