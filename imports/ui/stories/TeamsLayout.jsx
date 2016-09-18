import React      from 'react';
import { storiesOf, action } from '@kadira/storybook';

import ChatLayout from '../team/chat/ChatLayout.jsx';

let boards = [];
let users = [
  {
    _id: '0',
  	emails: [
  		{ address: 'ryanitzcovitz@gmail.com' }
  	],
  	profile: {
  		name: 'Ryan',
  		picture: '/img/chat/messages.svg'
  	},
  },
  {
    _id: '1',
    emails: [
      { address: 'mmiguerodriguez@gmail.com' }
    ],
    profile: {
      name: 'Migu3x',
      picture: '/img/chat/messages.svg'
    }
  }
];

let messages = [
  {
    senderId: users[0]._id,
  	type: "text",
  	content: 'Lorem ipsum dolor sit amet',
  	createdAt: new Date().getTime(),
  	directChatId: '2',
  	seen: false,
  },
  {
    senderId: users[1]._id,
  	type: "text",
  	content: 'Lorem ipsum dolor sit amet',
  	createdAt: new Date().getTime(),
  	directChatId: '3',
  	seen: false,
  }
];
let chat = {
  directChatId: '4',
  messages
};
let directChats = [
  {
    _id: chat.directChatId,
    teamId: '6',
    users: [
      {
        _id: users[0]._id,
        notifications: 25,
      },
      {
        _id: users[1]._id,
        notifications: 12,
      }
    ]
  }
];
storiesOf('ChatLayout', module)
  .add('chat', () => {
    return (
      <ChatLayout
        key={ chat.directChatId || chat.boardId }
        chat={ chat }
        users={ users }
        boards={ boards }
        directChats={ directChats }
        position={ 'mobile' }
        removeChat={ (() => {}) }/>
    );
  });
