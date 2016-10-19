import { Meteor } from 'meteor/meteor';
import { Mongo }  from 'meteor/mongo';

export const Modules = new Mongo.Collection('Modules');

const modules = [
  {
    _id: 'post-it',
    name: 'Post it',
    img: '/modules/post-it/image.png',
    description: 'I\'m a post it',
    settings: {
      width: 270,
      minWidth: 270,
      height: 400,
      minHeight: undefined,
    },
    validated: true,
  },
  {
    _id: 'task-manager',
    name: 'Organizador de tareas',
    img: '/modules/task-manager/image.png',
    description: 'Organizador de tareas',
    settings: {
      width: 312,
      minWidth: 312,
      height: 400,
      minHeight: undefined,
    },
    validated: true,
  },
  {
    _id: 'drive',
    name: 'Google Drive',
    img: '/modules/drive/image.png',
    description: 'This is a File Manager',
    settings: {
      width: 400,
      minWidth: 400,
      height: 400,
      minHeight: undefined,
    },
    validated: true,
  },
  {
    _id: 'videocall',
    name: 'Videollamada',
    img: '/modules/videocall/image.png',
    description: 'This is a Web RTC module',
    settings: {
      width: 270,
      minWidth: 270,
      height: 290,
      minHeight: 290,
    },
    validated: true,
  },
];

if (Meteor.isServer) {
  modules.forEach((module) => {
    if (!Modules.findOne(module._id)) {
      Modules.insert(module);
    }
  });
}
