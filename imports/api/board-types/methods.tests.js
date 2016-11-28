import { Meteor }        from 'meteor/meteor';
import { Factory }       from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { assert }        from 'meteor/practicalmeteor:chai';
import faker             from 'faker';

import { BoardTypes }    from '../board-types/board-types';
import { createBoardType,
  archiveBoardType,
  dearchiveBoardType }   from './methods';

import '../factories/factories';

if (Meteor.isServer) {
  describe('Board Types', () => {
    describe('Methods', () => {
      let user;
      let team;
      let properties;

      before(() => {
        resetDatabase();

        user = Factory.create('user');
        team = Factory.create('team');
        properties = [
          Factory.create('boardTypeProp')._id,
          Factory.create('boardTypeProp')._id,
          Factory.create('boardTypeProp')._id,
        ];

        sinon.stub(Meteor, 'user', () => user);
      });

      after(() => {
        Meteor.user.restore();
      });

      it('should create a type of board', () => {
        const args = {
          name: faker.lorem.word(),
          teamId: team._id,
          properties,
        };

        const expect = args;

        createBoardType.call(args, (error) => {
          if (error) {
            throw new Meteor.Error(error);
          }

          const result = BoardTypes.findOne();
          delete result._id;

          assert.deepEqual(result, expect);
          assert.equal(1, BoardTypes.find().count());
        });
      });

      it('should archive a type of board', () => {
        Factory.create('boardType');

        const expect = BoardTypes.findOne();
        expect.archived = true;

        const args = {
          id: expect._id,
        };

        archiveBoardType.call(args, (error) => {
          if (error) {
            throw new Meteor.Erorr(error);
          }

          const result = BoardTypes.findOne();

          assert.deepEqual(result, expect);
        });
      });

      it('should dearchive a type of board', () => {
        Factory.create('boardType', { archived: true });

        const expect = BoardTypes.findOne();
        expect.archived = false;

        const args = {
          id: expect._id,
        };

        dearchiveBoardType.call(args, (error) => {
          if (error) {
            throw new Meteor.Erorr(error);
          }

          const result = BoardTypes.findOne();

          assert.deepEqual(result, expect);
        });
      });
    });
  });
}
