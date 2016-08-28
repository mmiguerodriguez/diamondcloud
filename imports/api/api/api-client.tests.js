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
      let user, moduleInstances, requests, callback;
      let subscriptionName, moduleInstanceId, request, callbackFunctions;

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
        sinon.stub(Meteor, 'subscribe', (_subscriptionName, _moduleInstanceId, _request, _callbackFunctions) => {
          subscriptionName = _subscriptionName;
          moduleInstanceId = _moduleInstanceId;
          request = _request;
          callbackFunctions = _callbackFunctions;
        });
      });

      afterEach(function() {
        Meteor.user.restore();
        Meteor.subscribe.restore();
      });

      it('should get the requested data when subscribing', (done) => {
        let DiamondAPI = generateApi(moduleInstances[0]._id);
        // Here comes the code that an API consumer would write.
        let reactiveData;
        callback = (data) => reactiveData = data;
        DiamondAPI.subscribe({ request: requests[0], callback });
        // Checking everything works
        chai.assert.equal(subscriptionName, 'moduleInstances.data');
        chai.assert.equal(moduleInstanceId, moduleInstances[0]._id);
        chai.assert.deepEqual(request, requests[0]);
        done();
      });
    });
  });
}
