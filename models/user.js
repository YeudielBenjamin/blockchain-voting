"use strict"
var thinky  = require("../util/thinky");
var bcrypt  = require("bcrypt-nodejs");
var type    = thinky.type;
var r       = thinky.r;
var Errors  = thinky.Errors;

var User = thinky.createModel("User", {
    id: type.string(),
    nombre: type.string(),
    clave_elector: type.string(),
    curp: type.string(),
    fecha_nacimiento: type.date(),
    estado: type.string(),
    municipio: type.string(),
    seccion: type.string(),
    localidad: type.string(),
    emision: type.string(),
    vigencia: type.string(),
    ine: type.string(),
    password: type.string(),
    firstLogin: type.boolean(),
    keyPairsGenerated: type.boolean()
});

User.defineStatic("getView", function(){
    return this.without(["password", "firstLogin", "keyPairsGenerated"]);
});

User.define("clear", function(){
    delete this.password;
    delete this.firstLogin;
    delete this.keyPairsGenerated;
    delete this.publicKey;
    return this;
});

User.defineStatic("unique", function(){
    return this.nth(0).default(r.error("Document not found"));
});

/*User.pre("validate", function(next){
    if (!this.nombre || !this.clave_elector || !this.curp || !this.fecha_nacimiento ||
        !this.estado || !this.municipio || !this.seccion || !this.localidad ||
        !this.emision ||  !this.vigencia || !this.ine){

        next(new Error("Missing values for new User"));
    }
    bcrypt.hash(this.curp + "12345", null, null, (err, hash) => {
        if (err){
            next(Error(err));
        }
        this.password = hash;
        this.firstLogin = true;
        this.keyPairsGenerated = false;
    });

    next();
});*/

User.ensureIndex("curp");

module.exports = User;