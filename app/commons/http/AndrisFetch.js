const fetch = require("node-fetch");

// const fetch = function (url) {
//     return new Promise((resolve, reject) => {
//         fetchUrl(url, function (error, meta, body) {
//             if (error !== null) {
//                 reject(JSON.parse(error.toString()));
//             }

//             console.log('body',body.toString());
//             resolve(JSON.parse(body.toString()));
//         });
//     })
// }

module.exports = {

    fetch: (url) => {
		return fetch(url, {
	    	method : "GET"
		}).then(res => {
            try {
                return res.json()
            } catch (e) {
                throw e;
            }
        })
        .then((data) => {
            return data
        })
        .catch(error => {
            throw error;
        });
	}
};

// module.exports = {
//     fetch: fetch
// }

