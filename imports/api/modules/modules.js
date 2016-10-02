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
    img: "/modules/hYsHKx3br6kLYq3km/image.png",
    description: "Organizador de tareas",
    validated: true,
  },
  {
    _id: "drive",
    name: "File Manager",
    img: "/modules/wjQyQ6sGjzvNMDLiJ/image.png",
    description: "This is a File Manager",
    validated: true,
  },
  /*
  {
    _id: "Hwqpiuufhsdf735sj",
    name: "File Picker",
    img: "/modules/Jjwjg6gouWLXhMGKW/image.png",
    description: "Google Drive API test",
    validated: true,
  }
  */
];
