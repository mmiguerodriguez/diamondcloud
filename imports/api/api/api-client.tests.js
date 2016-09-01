import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { printObject }          from '../helpers/print-objects.js';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               '../factories/factories.js';

import { ModuleInstances }      from '../module-instances/module-instances.js';

import { generateApi }           from './api-client.js';

if (Meteor.isClient) {
  describe('Modules API', () => {
    describe('Client subscriptions', () => {
      let subscriptionName, collectionId, request,
          user, moduleInstances, requests, callback,
          reactiveData, name, params, myCallback,
          callbackFunctions;

      beforeEach(function() {
        Meteor.call('testing.resetDatabase');

        user = Factory.create('user');

        moduleInstances = [
          Factory.create('todosModuleInstance'),
          Factory.create('moduleInstance'),
        ];

        requests = [
          {
            collection: 'todos',
            condition: {
              $eq: ['$$element.boardId', 'designBoardId'],
            },
          },
          {
            collection: 'categories',
            condition: {
              $eq: ['$$element.color', 'red'],
            },
          },
        ];


        Meteor.users.insert(user);
        sinon.stub(Meteor, 'user', () => user);
        sinon.stub(Meteor, 'subscribe', (_subscriptionName, _collectionId, _request, _callbackFunctions) => {
          subscriptionName = _subscriptionName;
          collectionId = _collectionId;
          request = _request;
          callbackFunctions = _callbackFunctions;
        });
        sinon.stub(Meteor, 'call', (_name, _params, _callback) => {
          name = _name;
          params = _params;
          myCallback = _callback;
        });
      });

      afterEach(function() {
        Meteor.user.restore();
        Meteor.subscribe.restore();
        Meteor.call.restore();
      });

      it('should get the requested data when subscribing', (done) => {
        let DiamondAPI = generateApi({ collectionId: moduleInstances[0]._id });
        // Here comes the code that an API consumer would write.
        let reactiveData;
        callback = (data) => reactiveData = data;
        DiamondAPI.subscribe({ request: requests[0], callback });
        // Checking everything works
        chai.assert.equal(subscriptionName, 'moduleInstances.data');
        chai.assert.equal(collectionId, moduleInstances[0]._id);
        chai.assert.deepEqual(request, requests[0]);
        done();
      });
      it('should insert object to a module instance data', () => {
        let DiamondAPI = generateApi({ collectionId: moduleInstances[1]._id });
        DiamondAPI.insert({
          collection: 'testCollection',
          obj: {
            prop1: 'val1',
            prop2: 'val2',
          },
          visibleBy: [
            { userId: 'userId' },
          ],
          callback: () => {
            return "value";
          },
        });
        chai.assert.equal(name, 'API.methods.apiInsert');
        chai.assert.deepEqual(params, {
          collectionId: moduleInstances[1]._id,
          collection: 'testCollection',
          obj: {
            prop1: 'val1',
            prop2: 'val2',
          },
          visibleBy: [
            { userId: 'userId' },
          ],
        });
        chai.assert.equal(myCallback(), 'value');
      });
      it('should update an entry in module instance data', () => {
        let DiamondAPI = generateApi({ collectionId: moduleInstances[0]._id });
        DiamondAPI.update({
          collection: 'categories',
          filter: {
            _id: 'categoryId1',
          },
          updateQuery: {
            $set: {
              color: 'Yellow',
            }
          },
          callback: (err, res) => {
            return 'value';
          }
        });
        chai.assert.equal(name, 'API.methods.apiUpdate');
        chai.assert.deepEqual(params, {
          collectionId: moduleInstances[0]._id,
          collection: 'categories',
          filter: {
            _id: 'categoryId1',
          },
          updateQuery: {
            $set: {
              color: 'Yellow',
            }
          },
        });
        chai.assert.equal(myCallback(), 'value');
      });
      it('should get an entry in module instance data', () => {
        let DiamondAPI = generateApi({ collectionId: moduleInstances[0]._id });
        DiamondAPI.get({
          collection: 'todos',
          filter: {
            categoryId: 'categoryId1',
          },
          callback: (err, res) => {
            return 'value';
          }
        });
        chai.assert.equal(name, 'API.methods.apiGet');
        chai.assert.deepEqual(params, {
          collectionId: moduleInstances[0]._id,
          collection: 'todos',
          filter: {
            categoryId: 'categoryId1'
          },
        });
        chai.assert.equal(myCallback(), 'value');
      });
      it('should remove an entry from module instance data', () => {
        let DiamondAPI = generateApi({ collectionId: moduleInstances[0]._id });
        DiamondAPI.remove({
          collection: 'todos',
          filter: {
            categoryId: 'categoryId1',
          },
          callback: (err, res) => {
            return 'value';
          }
        });
        chai.assert.equal(name, 'API.methods.apiRemove');
        chai.assert.deepEqual(params, {
          collectionId: moduleInstances[0]._id,
          collection: 'todos',
          filter: {
            categoryId: 'categoryId1'
          },
        });
        chai.assert.equal(myCallback(), 'value');
      });
      it('should return the correct team data', () => {
        let DiamondAPI = generateApi({ boards: 'boards', users: 'users' });
        let result = DiamondAPI.getTeamData();
        chai.assert.equal(result.boards, 'boards');
        chai.assert.equal(result.users, 'users');
      });
    });
  });
}
