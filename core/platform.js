var Logger = require("disnode-logger");
var Axios = require('axios');

class Platform {
    constructor(disnode) {
        this.disnode = disnode;
    }

    GetUserUltra(userID) {
        var self = this;

        return new Promise(function (resolve, reject) {
            Axios.get("https://www.disnodeteam.com/api/user/" + userID + "/ultra")
            .then(function (res) {
                if (res.data.type == "ERR") {
                    
                    reject(res.data.data);
                     return;
                 }
                resolve(res.data.data);
            }).catch(function (err) {
                reject(err.message)
            })
        });
    }

}

module.exports = Platform;
