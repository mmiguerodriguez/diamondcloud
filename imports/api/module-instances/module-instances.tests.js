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
  describe('Module Instances', () => {
    describe('Helpers', () => {
      let boards, moduleInstance, moduleInstances;

      beforeEach(() => {
        resetDatabase();
        
        moduleInstance = Factory.create('moduleInstance');
        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];
        boards = [
          Factory.create('publicBoard', {
            moduleInstances: [
              { _id: moduleInstance._id }
            ],
          }),
          Factory.create('publicBoard'),
        ];
        
        resetDatabase();
        
        boards.forEach((board) => {
          Boards.insert(board);
        });
        ModuleInstances.insert(moduleInstance);
      });

      it('should return board of a module instance', () => {
        let result = moduleInstance.board();
        chai.assert.deepEqual(result, boards[0]);
      });
      
      it('should insert module instances and append it to a board', (done) => {
        _.each(moduleInstances, (moduleInstance) => {
          delete moduleInstance._id;
        });
        
        ModuleInstances.insertManyInstances(moduleInstances, boards[1]._id, (error, result) => {
          if (!!error) {
            throw new Meteor.Error(error);
          } else {
            let board = Boards.findOne({ _id: boards[1]._id });
            chai.assert.equal(board.moduleInstances.length, 3);
            
            done();
          }
        });
      });
    });
  });
}
