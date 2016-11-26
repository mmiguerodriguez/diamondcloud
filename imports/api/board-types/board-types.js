import { Mongo } from 'meteor/mongo';

export const BoardTypes = new Mongo.Collection('BoardTypes');

const boardTypes = [
  {
    name: 'test1',
    permissions: [
      'hasHideButton',
    ],
  },
  {
    name: 'test2',
    permissions: [],
  },
];

if (BoardTypes.find().count() < boardTypes.length) {
  boardTypes.forEach((boardType) => {
    if (!BoardTypes.findOne(boardType._id)) {
      BoardTypes.insert(boardType);
    }
  });
}

//helpers en teams para agarrar todos los boardTypes de un team
BoardTypes.getBoardsByType = boardTypeId => {
  return Boards.find({ boardType: boardTypeId });
};
