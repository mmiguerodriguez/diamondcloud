import { Mongo } from 'meteor/mongo';

export let Modules = new Mongo.Collection('Modules');

export let createdModules = [
  {
    _id: "post-it",
    name: "Post it",
    img: "/modules/post-it/image.png",
    description: "I\"m a post it",
    validated: true,
  },
  {
    _id: "trello",
    name: "Organizador de tareas",
    img: "/modules/trello/image.png",
    description: "Organizador de tareas",
    validated: true,
  },
  {
    _id: "drive",
    name: "File Manager",
    img: "/modules/drive/image.png",
    description: "This is a File Manager",
    validated: true,
  },
  {
    _id: "webrtc",
    name: "Web RTC",
    img: "/modules/webrtc/image.png",
    description: "This is a Web RTC module",
    validated: true,
  },
];
