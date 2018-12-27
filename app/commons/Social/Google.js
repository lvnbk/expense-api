const google = _config("services").google;
const got = require("got");
let googleApi = `https://www.googleapis.com`;
var ValidationError = _facade('Error/ValidationError');

/**
 * Google Auth Handler
 */
class Google {
    /**
     * Google OAuth 2 URL
     * @returns {string}
     */
    getAuthUrl () {
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google.clientID}&redirect_uri=${google.callbackURL}&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login&state=true&include_granted_scopes=true&response_type=code`;
    }

    /**
     * Google OAuth 2 URL Admin
     * @returns {string}
     */
    getAuthUrlAdmin () {
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google.clientID}&redirect_uri=${google.callbackURLAdmin}&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login&state=true&include_granted_scopes=true&response_type=code`;
    }

    /**
     * Exchange Access Token
     * @param code
     * @returns {Promise.<void>}
     */
    async getAccessToken(code) {
        try {
            let { body } = await got.post(`${googleApi}/oauth2/v4/token`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `code=${code}&client_id=${google.clientID}&client_secret=${google.clientSecret}&redirect_uri=${google.callbackURL}&grant_type=${google.grantType}`,
                timeout: 10000
            });
            return JSON.parse(body);
        } catch (e) {
            console.log("ERROR - ", e.message);
            throw e;
        }
    }

    /**
     * Exchange Access Token
     * @param code
     * @returns {Promise.<void>}
     */
    async getAccessTokenAdmin(code) {
        try {
            let { body } = await got.post(`${googleApi}/oauth2/v4/token`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `code=${code}&client_id=${google.clientID}&client_secret=${google.clientSecret}&redirect_uri=${google.callbackURLAdmin}&grant_type=${google.grantType}`,
                timeout: 10000
            });
            return JSON.parse(body);
        } catch (e) {
            console.log("ERROR - ", e.message);
            throw e;
        }
    }

    /**
     * Get User Information
     * @param access_token
     * @returns {Promise.<void>}
     */
    async getUserInfo(access_token) {
        try {
            let { body } = await got(`${googleApi}/plus/v1/people/me?access_token=${access_token}`);
            let user_info = JSON.parse(body);

            let regex = /sz=50/;

            user_info.image.url = user_info.image.url.replace(regex, 'sz=200');

            // Normalization user_info
            Object.assign(user_info, {
                name: user_info.displayName ,
                picture: {data: {url: (user_info.image || {}).url || ''}}
            });

            return user_info;
        } catch (e) {
            console.log("ERROR - ", e.message);
            throw new ValidationError({
                field: "access_token",
                message: "Token social method invalid"
            });
            //throw e;
        }
    }
}

module.exports = new Google();