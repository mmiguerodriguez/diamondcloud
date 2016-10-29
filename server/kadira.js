import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/meteorhacks:kadira';

Kadira.connect(
  Meteor.settings.private.kadira.appId,
  Meteor.settings.private.kadira.appSecret
);
