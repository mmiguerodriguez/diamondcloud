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
    _id: "drive",
    name: "Drive",
    img: "/modules/drive/image.png",
    description: "This is Drive (Sparta)!",
    validated: true,
  },
];
