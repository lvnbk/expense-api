var Facebook  = require("./Facebook");
var Google    = require("./Google");

class SocialAuthHandler {
    /**
     * Redirect to social oauth url
     * @param social
     * @returns {*}
     */
    redirectAuthURL (social) {
        let socialAuth = social.toLowerCase();
        if(socialAuth === "facebook") {
            return Facebook.getAuthUrl();
        } else if(socialAuth === "google") {
            return Google.getAuthUrl();
        }
    }

    /**
     * Redirect to social oauth url admin
     * @param social
     * @returns {*}
     */
    redirectAuthURLAdmin (social) {
        let socialAuth = social.toLowerCase();
        if(socialAuth === "facebook") {
            return Facebook.getAuthUrlAdmin();
        } else if(socialAuth === "google") {
            return Google.getAuthUrlAdmin();
        }
    }

    /**
     * Handle social callback url
     * @param social
     * @param query
     * @returns {Promise.<*>}
     */
    async handleSocialCallback(social, query) {
        try {
            let social_token = null;
            let user_info    = null;
            let socialAuth   = social.toLowerCase();

            try {
                if(socialAuth === "facebook") {
                    social_token = await Facebook.getAccessToken(query.code); 
                    user_info    = await Facebook.getUserInfo(social_token.access_token); 
                    user_info.website = 'https://fb.com/' + user_info.id;
                } else {
                    social_token = await Google.getAccessToken(query.code);
                    user_info    = await Google.getUserInfo(social_token.access_token);
                    user_info.website = user_info.url;
                }
            } catch (e) {
                throw e;
            }
            return user_info;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Handle social callback url
     * @param social
     * @param query
     * @returns {Promise.<*>}
     */
    async handleSocialCallbackAdmin(social, query) {
        try {
            let social_token = null;
            let user_info    = null;
            let socialAuth   = social.toLowerCase();

            try {
                if(socialAuth === "facebook") {
                    social_token = await Facebook.getAccessTokenAdmin(query.code); 
                    user_info    = await Facebook.getUserInfo(social_token.access_token); 
                    user_info.website = 'https://fb.com/' + user_info.id;
                } else {
                    social_token = await Google.getAccessTokenAdmin(query.code); 
                    user_info    = await Google.getUserInfo(social_token.access_token); 
                    user_info.website = 'https://plus.google.com/' + user_info.id;
                }
            } catch (e) {
                throw e;
            }
            return user_info;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = new SocialAuthHandler();