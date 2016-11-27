import { Mongo }        from 'meteor/mongo';

import { Modules }      from '../modules/modules';
import readModuleConfig from '../helpers/read-module-config';

export const BoardTypeProps = new Mongo.Collection('BoardTypeProps');

BoardTypeProps.helpers({});
BoardTypeProps.findByKey = key => BoardTypeProps.findOne({ key });

/**
* BoardTypeProps
* - can_be_hidden
*/
const boardTypeProps = [
  {
    key: 'can_be_hidden',
    name: 'Puede ser escondido',
    description: 'Permite esconder o no un pizarrón a usuarios',
  },
];


Modules.find().fetch().forEach((module) => {
  readModuleConfig(module._id)
  .then((result) => {
    const { settings } = result;

    settings.boardTypeProps.forEach((boardTypeProp) => {
      if (!BoardTypeProps.findByKey(boardTypeProp.key)) {
        BoardTypeProps.insert(boardTypeProp);
      }
    });
  }, (error) => {
    if (error.code === 'ENOENT') {
      console.log(`${module.name} config.json file wasn't found`);
    }
  });
});

boardTypeProps.forEach((boardTypeProp) => {
  if (!BoardTypeProps.findByKey(boardTypeProp.key)) {
    BoardTypeProps.insert(boardTypeProp);
  }
});
