import { Meteor }         from 'meteor/meteor';
import { Factory }        from 'meteor/dburles:factory';
import { assert }         from 'meteor/practicalmeteor:chai';

import { BoardTypeProps } from './board-type-props';
import                      '../factories/factories';

if (Meteor.isServer) {
  describe('BoardTypeProps', () => {
    describe('Interfaces', () => {
      it('should find a permission by its key', () => {
        const boardTypeProp = Factory.create('boardTypeProp');
        const result = BoardTypeProps.findByKey(boardTypeProp.key);

        assert.deepEqual(boardTypeProp, result);
      });
    });
  });
}
