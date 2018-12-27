'use strict'

const util = require('util');
const facebook = require("../../../config/services").facebook;
const AndisFetch = require("../HttpClient/AndrisFerch");

const graphUrl = 'https://graph.facebook.com';
const version = 'v2.11';
const fields = ['picture.width(200).height(200)', 'name', 'email', 'gender', 'verified', 'link'];

class Facebook{
    getAuthUrl(social){
        return util.format('https://www.facebook.com/%s/dialog/oauth?%20client_id=%s&redirect_uri=%s&state=true',
            version, facebook.clientID, facebook.callbackURL);
    }

    getAuthUrlAdmin(social){
        return util.format('https://www.facebook.com/%s/dialog/oauth?%20client_id=%s&redirect_uri=%s&state=true',
            version, facebook.clientID, facebook.callbackURLAdmin);
    }

    async getAccessToken(code){
        let url = util.format('%s/%s/oauth/access_token?client_id=%s&redirect_uri=%s&client_secret=%s&code=%s',
            graphUrl, version, facebook.clientID, facebook.callbackURL, facebook.clientSecret, code);
        let result = await AndisFetch.fetch(url);
        return result;
    }

    async getAccessTokenAdmin(code){
        let url = util.format('%s/%s/oauth/access_token?client_id=%s&redirect_uri=%s&client_secret=%s&code=%s',
            graphUrl, version, facebook.clientID, facebook.callbackURLAdmin, facebook.clientSecret, code);
        let result = await AndisFetch.fetch(url);
        return result;
    }

    async getUserInfo(access_token) {
        let url = util.format('%s/%s/me?access_token=%s&fields=%s', 
            graphUrl, version, access_token,fields);
        let result = await AndisFetch.fetch(url);
        return result;
    }
}

module.exports = new Facebook();