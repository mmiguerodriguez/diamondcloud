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
    _id: "wFNjYPHRotdzdmb72",
    name: "Document",
    img: "/modules/Jjwjg6gouWLXhMGKW/image.png",
    description: "This is a document",
    validated: true,
  }
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
