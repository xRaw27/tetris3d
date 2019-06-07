class Database {
    constructor(mongoClient, uri, dbName) {
        this.mongoClient = mongoClient
        this.uri = uri
        this.dbName = dbName
    }

    connect(callback) {
        this.mongoClient.connect(this.uri + "/" + this.dbName, (err, db) => {
            if (err) {
                console.log(err)
                callback(false)
            }
            else {
                callback(db)
            }
        })
    }

    registerUser(username, password, bcrypt, callback) {
        console.log("register!")
        this.connect(db => {
            if (!db) {
                callback({ status: "DB_ERROR" })
                return
            }
            db.collection("users", (err, coll) => {
                if (err) {
                    db.close()
                    callback({ status: "DB_ERROR" })
                    return
                }
                coll.findOne({ username: username }, (err, user) => {
                    if (err) {
                        db.close()
                        callback({ status: "DB_ERROR" })
                        return
                    }
                    if (user != null) {
                        db.close()
                        callback({ status: "USER_EXIST" })
                        return
                    }
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) throw err
                        coll.insert({ username: username, password: hash, score: 0 }, (err, result) => {
                            if (err) {
                                db.close()
                                callback({ status: "DB_ERROR" })
                                return
                            }
                            let newUsername = result.ops[0].username
                            db.close()
                            callback({ status: "SUCCESS", username: newUsername })

                        })
                    })

                })
            })
        })
    }

    loginUser(username, password, bcrypt, callback) {
        this.connect(db => {
            if (!db) {
                console.log("Błąd bazy danych!")
                callback({ status: "DB_ERROR" })
                return
            }
            db.collection("users", (err, coll) => {
                if (err) {
                    db.close()
                    callback({ status: "DB_ERROR" })
                    return
                }
                coll.findOne({ username: username }, (err, user) => {
                    if (err) {
                        db.close()
                        callback({ status: "DB_ERROR" })
                        return
                    }
                    if (!user) {
                        db.close()
                        callback({ status: "USER_NO_EXIST" })
                        return
                    }
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (!res) {
                            db.close()
                            callback({ status: "BAD_PASSWORD" })
                            return
                        }
                        db.close()
                        console.log(user.username)
                        callback({ status: "SUCCESS", username: user.username, score: user.score })
                    })
                })

            })
        })
    }
    updateScore(username, score, callback) {
        this.connect(db => {
            if (!db) {
                console.log("Błąd bazy danych!")
                callback({ status: "DB_ERROR" })
                return
            }
            db.collection("users", (err, coll) => {
                if (err) {
                    db.close()
                    callback({ status: "DB_ERROR" })
                    return
                }
                coll.findOne({ username: username }, (err, user) => {
                    if (err) {
                        db.close()
                        callback({ status: "DB_ERROR" })
                        return
                    }
                    if (user.score >= score) {
                        db.close()
                        callback({ status: "NO_CHANGED" })
                        return
                    }
                    coll.updateOne(
                        { username: username },
                        { $set: { score: score } },
                        (err, data) => {
                            if (err) {
                                db.close()
                                callback({ status: "DB_ERROR" })
                                return
                            }
                            db.close()
                            callback({ status: "UPDATED" })
                        }
                    )
                })
            })
        })
    }


}

module.exports = Database