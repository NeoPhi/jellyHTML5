var PARAMS = {
  extension: {
    js: process.env.JS_EXT,
    css: process.env.CSS_EXT
  },
  server: {
    port: process.env.PORT,
    url: process.env.URL_BASE
  },
  mongo: {
    url: process.env.MONGODB_URL
  },
  redis: {
    url: process.env.REDIS_URL
  },
  dailyCred: {
    id: process.env.DAILY_CRED_ID,
    secret: process.env.DAILY_CRED_SECRET
  },
  session: {
    secret: process.env.SESSION_SECRET
  }
};

for (var key in PARAMS) {
  if (PARAMS.hasOwnProperty(key)) {
    var value = PARAMS[key];
    for (var subKey in value) {
      if (value.hasOwnProperty(subKey) && !value[subKey]) {
        throw new Error(key + ':' + subKey + ' is not configured');
      }
    }
    module.exports[key] = value;
  }
}
