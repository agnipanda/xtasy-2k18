var mongoose = require('mongoose'); 
var request = require('request');
var mailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var bcrypt = require('bcrypt');
var UserModel = require('../models/user');

var options = {
    service: 'gmail',
    secure: true,
    auth: {
        user: 'xtasy.2018@gmail.com',
        pass: 'CeTjInDaBaD2018'
    }
};

var transport = mailer.createTransport(smtpTransport(options));

var passwordReset = function (req,res) {
//  if(!req.body.emailid ) res.json({"msg": "Enter your email"});
  UserModel.findOne({ emailid : req.body.emailid},function (err,doc) {
    if(err) throw(err);
    if(doc){
      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.emailid, salt, function(err, hash) {
              // Store hash in your password DB.
                var link = req.protocol + '://' + req.get('host') + '/api/reset?email=' + req.body.emailid +'&code=' + hash;
                var mail = {
                    from: "noreply@xtasy.cetb.in",
                    to: req.body.emailid,
                    subject: "Reset your password for xtasy",
                    html: "<b>Hello " + doc.name + "!</b><br>" + "<p>" + "Click on the <a href='"
                        + link + "'>link</a> to reset your password</p>" +
                        "<br><small>You are receiving this mail because you or someone posing as you is" +
                        " trying to register for xtasy</small>"
                };

           transport.sendMail(mail, (error, response) => {
                transport.close()
                if (error) {
                    console.log(error);
                    res.redirect("/login?action=3")
                } else {
                    console.log("Mail has been sent")
                    res.redirect("/login?action=7");
                }
            })
          });
        });
    }
    else{
      res.redirect("/login?action=2");
    }
  })
}

module.exports = {"passwordReset" : passwordReset}