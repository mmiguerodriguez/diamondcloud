import { Mongo }  from 'meteor/mongo';

export const BoardTypeProps = new Mongo.Collection('BoardTypeProps');

const boardTypeProps = [
  {
    key: 'can_be_hidden',
    name: 'Puede ser escondido',
    description: '',
  },
];

if (BoardTypeProps.find().count() < BoardTypeProps.length) {
  boardTypeProps.forEach((boardTypeProp) => {
    if (!BoardTypeProps.findOne(boardTypeProp._id)) {
      BoardTypeProps.insert(boardTypeProp);
    }
  });
}
