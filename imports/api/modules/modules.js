import { Mongo } from 'meteor/mongo';

export let Modules = new Mongo.Collection('Modules');

export let createdModules = [
  {
    _id: "Jjwjg6gouWLXhMGKW",
    name: "Post it",
    img: "/modules/Jjwjg6gouWLXhMGKW/image.png",
    description: "I\"m a post it",
    validated: true,
  },
  {
    _id: "hYsHKx3br6kLYq3km",
    name: "Organizador de tareas",
    img: "/modules/hYsHKx3br6kLYq3km/image.png",
    description: "Organizador de tareas",
    validated: true,
  },
  {
    _id: "wjQyQ6sGjzvNMDLiJ",
    name: "File Manager",
    img: "/modules/wjQyQ6sGjzvNMDLiJ/image.png",
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
