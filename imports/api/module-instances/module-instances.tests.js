import { Meteor }          from 'meteor/meteor';
import { resetDatabase }   from 'meteor/xolvio:cleaner';
import { sinon }           from 'meteor/practicalmeteor:sinon';
import { chai }            from 'meteor/practicalmeteor:chai';
import { Random }          from 'meteor/random';
import   faker             from 'faker';

import { ModuleInstances } from './module-instances';
import { Boards }          from '../boards/boards';
import { Teams }           from '../teams/teams';

import '../factories/factories';

if (Meteor.isServer) {
  describe('Module Instances', () => {
    describe('Helpers', () => {
      let user;
      let team;
      let boards;
      let moduleInstance;
      let moduleInstances;

      beforeEach(() => {
        resetDatabase();

        user = Factory.create('user');
        moduleInstance = Factory.create('moduleInstance');
        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];
        boards = [
          Factory.create('publicBoard', {
            users: [
              { email: user.emails[0].address, notifications: 0 },
            ],
            moduleInstances: [
              { _id: moduleInstance._id },
            ],
          }),
          Factory.create('publicBoard', {
            users: [
              { email: user.emails[0].address, notifications: 0 },
            ],
          }),
        ];
        team = Factory.create('team', {
          users: [
            { email: user.emails[0].address, hierarchy: 'sistemas' },
          ],
          boards: [
            { _id: boards[1]._id },
          ],
        });

        resetDatabase();

        Teams.insert(team);
        boards.forEach((board) => {
          Boards.insert(board);
        });
        ModuleInstances.insert(moduleInstance);
        Meteor.users.insert(user);

        sinon.stub(Meteor, 'user', () => user);
        sinon.stub(Meteor, 'userId', () => user._id);
      });

      afterEach(() => {
        Meteor.user.restore();
        Meteor.userId.restore();
      })

      it('should return the board of a module instance', () => {
        const result = moduleInstance.board();
        chai.assert.deepEqual(result, boards[0]);
      });

      it('should insert module instances and append it to a board', (done) => {
        _.each(moduleInstances, (moduleInstance) => {
          delete moduleInstance._id;
        });

        ModuleInstances.insertManyInstances(moduleInstances, boards[1]._id, (error, result) => {
          if (error) {
            console.log('holas jajaja');
            throw new Meteor.Error(error);
          } else {
            console.log('llegue al result');
            console.log(Boards);
            const board = Boards.findOne({ _id: boards[1]._id }, {}, (_error, _result) => {
              console.log(`error: ${_error}; result: ${_result}`)
            });
            console.log('El board es: ', JSON.stringify(board));
            chai.assert.equal(board.moduleInstances.length, 3);
            console.log('llegué al done()');
            done();
          }
        });
      });
    });
  });
}
