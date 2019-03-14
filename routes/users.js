

var uniqueid = require("shortid");
var validUrl = require('valid-url');

var pgp = require("pg-promise")();
var db = pgp("postgres://postgres:test@127.0.0.1:5432/url_db");

exports.convertUrl = convertUrl ;
exports.redirectUrl = redirectUrl ;




function convertUrl(req,res){

	var url      = req.body.url ;
	var baseUrl = "http://localhost:9000"
    
    

    if (validUrl.isUri(url)){
       

        var findQuery = "SELECT * from url_info where long_url=$1" ;
        db.any(findQuery, [url])
      .then(function(data) {
        // success;

       if(data.length != 0) {
       	 
         return res.send({
         	'log': 'Data Fetched Successfully',
         	'result': data.short_url
         });
       }

       else{

       	  const urlCode = uniqueid.generate();
       	  var short_url =  baseUrl + '/' + urlCode ;

     
       	var insertQuery = "INSERT into url_info (long_url,short_url, created_on) VALUES($1,$2,$3)";

       	db.none(insertQuery, [url,short_url, new Date()])
        .then(function(result) {
   
        res.send({
          log: "Data inserted successfully",
          shortUrl: short_url

        });
      })
       }

      })
      .catch(function(error) {

      	return res.send({
      		'log' : 'Internal server error' 

      	});
      })

      

    } else {
      
        return res.send({
        	'log' : 'Not a valid url'
        })
    }


}

/**
  *  short_url : "http://localhost:9000/uniqueid"
  */

function redirectUrl(req,res) {

	var short_url = req.body.short_url ;

	var Query = "SELECT long_url from url_info where short_url=$1";

    db.any(Query, [short_url])
      .then(function(data) {

      	res.redirect(data[0].long_url);
      })
      .catch(function(error) {

      	return res.send({
      		'log' : 'Internal server error' 

      	});
      })
}