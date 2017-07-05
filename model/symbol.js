/**
 * Created by apple on 7/5/17.
 */
var db = require('../db')

var repo = {}


repo.create = (symb) => {
    return db.get().then((db) => db.collection('symbol').findOne({symbol: symb})).then(doc => {
        if (doc == null) {
            return db.get().then(db => db.collection('symbol').insertOne({symbol: symb}))
        }
        return new Promise((resolve, reject)=>{ return reject() })
    })
}

repo.delete = (symb) => {
    return db.get().then((db) => db.collection('symbol').findOne({symbol: symb})).then(doc => {
        if (doc != null) {
            return db.get().then(db => db.collection('symbol').deleteOne({symbol: symb}))
        }
        return new Promise((resolve, reject)=>{ return reject() })
    })
}

repo.all = () => {
    return db.get().then((db) => db.collection('symbol').find().toArray())
}

module.exports = repo