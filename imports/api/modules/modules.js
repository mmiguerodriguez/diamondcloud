import { Mongo } from 'meteor/mongo';

export let Modules = new Mongo.Collection('Modules');

export let createdModules = [
  {
    _id: "Jjwjg6gouWLXhMGKW",
    name: "Post it",
    img: "/modules/Jjwjg6gouWLXhMGKW/image.png",
    description: "I\"m a post it",
    validated: true,
  }
];
