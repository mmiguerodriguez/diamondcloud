import { Meteor }           from 'meteor/meteor';
import { resetDatabase }    from 'meteor/xolvio:cleaner';
import { sinon }            from 'meteor/practicalmeteor:sinon';
import { chai }             from 'meteor/practicalmeteor:chai';
import { Random }           from 'meteor/random';
import   faker              from 'faker';

import { Drawings }         from './drawings.js';
import { createDrawing,
         archiveDrawing,
         dearchiveDrawing
}                           from './methods.js';

if (Meteor.isServer) {
  describe('Drawings', function() {
    let user = {
      _id: Random.id(),
      emails: [{ address: faker.internet.email() }],
      name: faker.name.findName(),
    },
    drawing = {
      _id: Random.id(),
      x: faker.random.number(),
      y: faker.random.number(),
      archived: false,
    };
    
    beforeEach(function() {
      resetDatabase();
      sinon.stub(Meteor, 'user', () => user);
      
      Drawings.insert(drawing);
    });
    afterEach(function() {
      Meteor.user.restore();
    });
    
    it('should create a drawing', function() {
      let result,
          expect,
          args;
      
      args = {
        x: faker.random.number(),
        y: faker.random.number(),
      };
      expect = {
        x: args.x,
        y: args.y,
        archived: false,
      };
      
      createDrawing.call(args, (err, res) => {
        if (err) throw new Meteor.Error(err);
        result = res;
      });
      
      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
    });
    it('should archive a drawing', function() {
      let test,
          result,
          expect;
      
      test = { 
        _id: drawing._id, 
      };
      expect = {
        _id: drawing._id,
        x: drawing.x,
        y: drawing.y,
        archived: true,
      };
      
      archiveDrawing.call(test, (err, res) => {
        if (err) throw new Meteor.Error(err);
        result = res;
      });
      
      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
    });
    it('should dearchive a drawing', function() {
      let test,
          result,
          expect;
      
      test = { 
        _id: drawing._id, 
      };
      expect = {
        _id: drawing._id,
        x: drawing.x,
        y: drawing.y,
        archived: false,
      };
      
      dearchiveDrawing.call(test, (err, res) => {
        if (err) throw new Meteor.Error(err);
        result = res;
      });
      
      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
    });
    /*
    it('should not create a drawing if x or y are bigger than expected', function() {
      
    });
    */
  });
}