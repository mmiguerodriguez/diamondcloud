module.exports = {
  servers: {
    one: {
      host: '104.131.158.182',
      username: 'root',
      // pem:
      password: 'diamondcloud'
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'cloud',
    path: './',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://diamondcloud.tk',
      // METEOR_DOWN_KEY: 'MY_SUPER_SECRET_KEY',
      // ROOT_URL: 'http://159.203.182.182',
      // MONGO_URL: '159.203.182.182'
    },

    //dockerImage: 'kadirahq/meteord'
    deployCheckWaitTime:60,
    
    dockerImage: 'abernix/meteord:base',
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};