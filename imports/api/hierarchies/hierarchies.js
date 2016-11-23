import { Mongo } from 'meteor/mongo';

export let Hierarchies = new Mongo.Collection('Hierarchies');

const hierarchies = [
  {
    name: 'Sistemas',
    permissions: [
      'access_all_boards',
    ],
  },
  {
    name: 'Creativo',
    permissions: [],
  },
  {
    name: 'Director creativo',
    permissions: [
      'access_visible_boards',
    ],
  },
  {
    name: 'Director de cuentas',
    permissions: [
      'access_visible_boards',
    ],
  },
  {
    name: 'Coordinador',
    permissions: [
      'access_all_boards',
    ],
  },
  {
    name: 'Administrador',
    permissions: [],
  },
  {
    name: 'Medios',
    permissions: [],
  },
];

if (Hierarchies.find().count() < hierarchies.length) {
  hierarchies.forEach((hierarchy) => {
    if (!Hierarchies.findOne(hierarchy._id)) {
      Hierarchies.insert(hierarchy);
    }
  });
}
