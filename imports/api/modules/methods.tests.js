import { resetDatabase } from 'meteor/xolvio:cleaner';
import faker from 'faker';

/*Factory.define('todo', Todos, {
  listId: () => Factory.get('list'),
  text: () => faker.lorem.sentence(),
  createdAt: () => new Date(),
});*/

/*Meteor.methods({
  'reemplazar.resetDatabase': () => resetDatabase(),
});

describe('my module', function (done) {
  beforeEach(function (done) {
    Meteor.call('test.resetDatabase', done);
  });
  it('renders correctly with simple data', function () {
    /*const todo = Factory.build('todo', { checked: false });
    const data = {
      todo,
      onEditingChange: () => 0,
    };
    chai.assert.equal(1, 1);*/
/*  });
});*/