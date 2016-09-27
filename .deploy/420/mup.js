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
    name: 'cloudDev',
    path: '../../cloudDev',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://diamondcloud.tk:420',
      PORT:'420',
      // METEOR_DOWN_KEY: 'MY_SUPER_SECRET_KEY',
      // ROOT_URL: 'http://159.203.182.182',
      //MONGO_URL: 'http://diamondcloud.tk:420'
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
