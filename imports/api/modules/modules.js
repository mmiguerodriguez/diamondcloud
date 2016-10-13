import { Mongo } from 'meteor/mongo';

export let Modules = new Mongo.Collection('Modules');

let modules = [
  {
    _id: "post-it",
    name: "Post it",
    img: "/modules/post-it/image.png",
    description: "I\"m a post it",
    validated: true,
  },
  {
    _id: "task-manager",
    name: "Organizador de tareas",
    img: "/modules/task-manager/image.png",
    description: "Organizador de tareas",
    validated: true,
  },
  {
    _id: "drive",
    name: "Google Drive",
    img: "/modules/drive/image.png",
    description: "This is a File Manager",
    validated: true,
  },
  {
    _id: "videocall",
    name: "Videollamada",
    img: "/modules/videocall/image.png",
    description: "This is a Web RTC module",
    validated: true,
  },
];

modules.forEach((module) => {
  if(!Modules.findOne(module._id)) {
    Modules.insert(module);
  }
});
