import { Mongo } from 'meteor/mongo';

export let Templates = new Mongo.Collection('Templates');

const templates = [
  {
    _id: 'default',
    name: 'Por defecto',
  },
  {
    _id: 'sistemas',
    name: 'Sistemas',
  },
  {
    _id: 'creativos',
    name: 'Creativos',
    moduleInstances: [
      { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
      { moduleId: 'drive', x: 50, y: 352, width: 400, height: 400, archived: false, minimized: false },
      { moduleId: 'videocall', x: 50, y: 772, width: 270, height: 290, archived: false, minimized: false },
    ],
  },
  {
    _id: 'coordinadores',
    name: 'Coordinadores',
    moduleInstances: [
      { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
    ],
  },
  {
    _id: 'directores creativos',
    name: 'Directores creativos',
    moduleInstances: [
      { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
      { moduleId: 'drive', x: 50, y: 352, width: 400, height: 400, archived: false, minimized: false },
    ],
  },
  {
    _id: 'directores de cuentas',
    name: 'Directores de cuentas',
    moduleInstances: [
      { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
      { moduleId: 'drive', x: 50, y: 352, width: 400, height: 400, archived: false, minimized: false },
    ],
  },
  {
    _id: 'administradores',
    name: 'Administradores',
    moduleInstances: [
      { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
      { moduleId: 'drive', x: 50, y: 352, width: 400, height: 400, archived: false, minimized: false },
    ],
  },
  {
    _id: 'medios',
    name: 'Medios',
    moduleInstances: [
      { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
      { moduleId: 'drive', x: 50, y: 352, width: 400, height: 400, archived: false, minimized: false },
    ],
  },
];

if (Templates.find().count() < templates.length) {
  templates.forEach((template) => {
    if (!Templates.findOne(template._id)) {
      Templates.insert(template);
    }
  });
}
