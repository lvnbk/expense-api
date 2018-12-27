module.exports = (params, postData, responseCallback) => {
    return new Promise(function(resolve, reject) {
        let timer = setTimeout(() => {
            req.abort();
            reject('ABORTING');
        }, 30000);

        let req = Https.request(params, function(res) {

            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                clearTimeout(timer);
                req.abort();
                if(responseCallback) {
                    responseCallback(res);
                }
                return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            let body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
                clearTimeout(timer);
                req.abort();
                try {
                    body = Buffer.concat(body).toString();
                } catch(e) {
                    reject(e);
                }
                if(responseCallback) {
                    responseCallback(res);
                }
                resolve(body);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            clearTimeout(timer);
            req.abort();
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (!!postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
    })
};