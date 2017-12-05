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
    let vote = req.body.vote.vote;
    let candidateId = req.body.vote.candidateId;
    let election = req.body.vote.election;
    let electionId = req.body.vote.electionId;
    let publicKey = req.body.publicKey;
    let privateKey = req.body.privateKey;

    const tx = bigchain.Transaction.makeCreateTransaction(
        { election_id: electionId, election_name: election, vote: vote, candidate_id: candidateId, date: new Date() },
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