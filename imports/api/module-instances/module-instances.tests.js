import { Meteor }                  from 'meteor/meteor';
import { resetDatabase }           from 'meteor/xolvio:cleaner';
import { sinon }                   from 'meteor/practicalmeteor:sinon';
import { chai }                    from 'meteor/practicalmeteor:chai';
import { Random }                  from 'meteor/random';
import   faker                     from 'faker';

import { ModuleInstances }         from './module-instances.js';
import { Boards }                  from '../boards/boards.js';

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
        ModuleInstances.insert(moduleInstance);
      });

      it('should return board of a module instance', function() {
        let result = moduleInstance.board();

        chai.assert.deepEqual(result, board);
      });
    });
  });
}
