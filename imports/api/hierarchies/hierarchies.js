import { Mongo } from 'meteor/mongo';

export let Hierarchies = new Mongo.Collection('Hierarchies');

/*

Permissions
  - accessAllBoards
  - accessVisibleBoards

*/

const hierarchies = [
  {
    _id: 'sistemas',
    name: 'Sistemas',
    permissions: [
      'accessAllBoards',
    ],
  },
  {
    _id: 'creativo',
    name: 'Creativo',
    permissions: [],
  },
  {
    _id: 'director creativo',
    name: 'Director creativo',
    permissions: [
      'accessVisibleBoards',
    ],
  },
  {
    _id: 'director de cuentas',
    name: 'Director de cuentas',
    permissions: [
      'accessVisibleBoards',
    ],
  },
  {
    _id: 'coordinador',
    name: 'Coordinador',
    permissions: [
      'accessAllBoards',
    ],
  },
  {
    _id: 'administrador',
    name: 'Administrador',
    permissions: [],
  },
  {
    _id: 'medios',
    name: 'Medios',
    permissions: [],
  }
];

if (Hierarchies.find().count() < hierarchies.length) {
  hierarchies.forEach((hierarchy) => {
    if (!Hierarchies.findOne(hierarchy._id)) {
      Hierarchies.insert(hierarchy);
    }
  });
}
