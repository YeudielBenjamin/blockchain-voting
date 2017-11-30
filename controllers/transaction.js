"use strict"
var globalVar   = require("../global");
const bigchain  =    require('bigchaindb-driver');

function createPair(req, res){
    return res.status(200).send({
        msg: "Transaction created", 
        success: true, 
        data: {
            keys: new bigchain.Ed25519Keypair()
        }
    });
}

function newTransaction(req, res){
    let vote = req.body.vote;
    let publicKey = req.body.publicKey;
    let privateKey = req.body.privateKey;

    const tx = bigchain.Transaction.makeCreateTransaction(
        { vote: vote },
        { what: "Vote" },
        [ bigchain.Transaction.makeOutput(
            bigchain.Transaction.makeEd25519Condition(publicKey))
        ],
        publicKey
    );
    const signedTx = bigchain.Transaction.signTransaction(tx, privateKey);
    const conn = new bigchain.Connection(globalVar.API_PATH);
    console.log(signedTx);
    conn.postTransaction(signedTx)
        .then(
            response => {
                return conn.pollStatusAndFetchTransaction(signedTx.id);
            },
            error => {
                return res.status(500).send({msg: "Error while conencting the blockchain", success: false, data: {error}});
            }
        ).then(
            response => {
                return res.status(200).send({msg: "Transaction created", success: true, data: response});
            },
            error => {
                return res.status(500).send({msg: "Error while retreiving your transaction", success: false, data: {error}});
            }
        );
}

module.exports = {
    createPair,
    newTransaction
};