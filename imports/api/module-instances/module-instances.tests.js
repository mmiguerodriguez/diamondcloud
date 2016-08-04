import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { ModuleInstances }         from './module-instances.js';
import { Boards }         from '../boards/boards.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Module Instances', function() {
    describe('Helpers', function(){
      let board, moduleInstance;

      beforeEach(function() {
        resetDatabase();
        board = Factory.create('publicBoard');
        moduleInstance = Factory.create('moduleInstance');
        board.moduleInstances.push({ _id: moduleInstance._id });
        resetDatabase();
        Boards.insert(board);
        Boards.insert(moduleInstance);
      });

      afterEach(function() {
        Meteor.user.restore();
      });

      it('should return the board in which the module instance is in', function() {
        let expected = board._id;
        let result = ModuleInstances.findOne(moduleInstance._id).board()._id;
        chai.assert.equal(result, expected);
      });
    });
  });
}
