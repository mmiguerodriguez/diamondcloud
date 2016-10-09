import { Meteor }          from 'meteor/meteor';
import { Random }          from 'meteor/random';
import faker		           from 'faker';

import { Teams }           from '../teams/teams.js';
import { Boards }          from '../boards/boards.js';
import { Messages }        from '../messages/messages.js';
import { ModuleData } from '../module-data/module-data.js';
import { DirectChats }     from '../direct-chats/direct-chats.js';
import { ModuleInstances } from '../module-instances/module-instances.js';

Factory.define('user', Meteor.users, {
	emails: [
		{ address: faker.internet.email() }
	],
	profile: {
		name: faker.name.findName(),
	},
});

Factory.define('board', Boards, {
	name: faker.lorem.word(),
	users: [],
	type: faker.lorem.word(),
	isPrivate: null,
	moduleInstances: [],
	archived: false,
});

Factory.define('publicBoard', Boards, Factory.extend('board', {
	isPrivate: false,
	users: [],
}));

Factory.define('privateBoard', Boards, Factory.extend('board', {
	isPrivate: true,
	users: [
		{ _id: Random.id(), notifications: faker.random.number({ min: 0, max: 20 }) },
	],
}));

Factory.define('team', Teams, {
	name: faker.company.companyName(),
	plan: Random.choice(['free', 'premium']),
	type: Random.choice(['web', 'android', 'ios', 'marketing']),
	boards: [],
	users: [
		{ email: faker.internet.email(), permission: 'owner' }
	],
	archived: false,
});

Factory.define('directChat', DirectChats, {
	teamId: Factory.get('team'),
	users: [
		{ _id: Random.id(), notifications: faker.random.number({ min: 0, max: 20 }) },
		{ _id: Random.id(), notifications: faker.random.number({ min: 0, max: 20 }) },
	]
});

Factory.define('message', Messages, {
	senderId: Factory.get('user')._id,
	type: "text",
	content: faker.lorem.sentence(),
	createdAt: new Date()
});

Factory.define('directChatMessage', Messages, Factory.extend('message', {
	directChatId: Factory.get('directChat')._id,
	seen: false,
}));

Factory.define('boardMessage', Messages, Factory.extend('message', {
	boardId: Factory.get('board')._id,
	seers: [],
}));

Factory.define('moduleInstance', ModuleInstances, {
	moduleId: Random.id(),
	x: faker.random.number(),
	y: faker.random.number(),
	width: faker.random.number({ min: 0, max: 1920 }),
	height: faker.random.number({ min: 0, max: 1080 }),
	archived: false,
	minimized: false,
});

Factory.define('moduleData', ModuleData, {
	moduleId: Random.id(),
	teamId: Factory.get('team')._id,
});

Factory.define('todosModuleData', ModuleData, Factory.extend('moduleData', {
	data: {
		todos: [
      {
        name: 'Define business model',
        boardId: 'businessBoardId',
        categoryId: 'categoryId1',
				isGlobal: false,
				moduleInstanceId: Factory.get('moduleInstance')._id,
      },
      {
        name: 'Research payment processors',
        boardId: 'businessBoardId',
        categoryId: 'categoryId1',
				isGlobal: false,
				moduleInstanceId: Factory.get('moduleInstance')._id,
      },
      {
        name: 'Design landing wireframe',
        boardId: 'designBoardId',
        categoryId: 'categoryId1',
				isGlobal: true,
      },
      {
        name: 'Develop modules API',
        boardId: 'programmingBoardId',
        users: [
          { _id: 'dylanId' },
          { _id: 'joelId' },
          { _id: 'migueId' },
        ],
        categoryId: 'categoryId2',
				isGlobal: true,
      },
      {
        name: 'Release the MVP',
        boardId: 'generalBoardId',
        categoryId: 'categoryId2',
				isGlobal: true,
      },
      {
        name: 'Some super secret task',
        boardId: 'secretBoardId',
        visibleBy: [
          { userId: 'obamaId' },
          { boardId: 'General' },
        ],
        categoryId: 'categoryId2',
				isGlobal: false,
				moduleInstanceId: Factory.get('moduleInstance')._id
      },
			{
        name: 'Conquer the world',
        boardId: 'secretBoardId',
        categoryId: 'categoryId3',
				isGlobal: false,
				moduleInstanceId: Factory.get('moduleInstance')._id
      }
    ],
		categories: [
      {
        _id: 'categoryId1',
        name: 'Lorem ipsum category',
				color: 'red',
				isGlobal: true,
      },
      {
        _id: 'categoryId2',
        name: 'Another great category',
				color: 'red',
				isGlobal: true,
      },
			{
        _id: 'categoryId3',
        name: 'Another great banana',
				color: 'blue',
				isGlobal: false,
				moduleInstanceId: Factory.get('moduleInstance')._id
      },
    ]
	},
}));
