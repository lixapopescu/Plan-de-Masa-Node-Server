module.exports = {
    "port": process.env.PORT || 8008,
    "base_url": "http://www.plandemasa.ro",
    "database": "mongodb://localhost:27017/plandemasa",
    "secret": "ilovescotchilovescotchilovescotch",
    facebook: {
        clientID: '1552098208384336',
        clientSecret: '461dc94b1ac0770a746b5d792da7d1f4',
        callbackURL: 'http://127.0.0.1:8008/auth/facebook/callback'
    },
    twitter: {
        consumerKey: 'get_your_own',
        consumerSecret: 'get_your_own',
        callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
    },
    github: {
        clientID: 'get_your_own',
        clientSecret: 'get_your_own',
        callbackURL: "http://127.0.0.1:1337/auth/github/callback"
    },
    google: {
        returnURL: 'http://127.0.0.1:1337/auth/google/callback',
        realm: 'http://127.0.0.1:1337'
    },

    "facebook_app_id": "1552098208384336",
    "facebook_app_secret": "461dc94b1ac0770a746b5d792da7d1f4",
    "facebook_callback_url": "/auth/facebook/callback"
};