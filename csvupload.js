/**
* @param context {WebtaskContext}
*/
const formidable = require('formidable-memory');
const csv = require('fast-csv');
const request = require('request');

module.exports = function (context, req, res) {
var arrstr = [];
var arrSchool = [];
var arrDistrict = [];
var strLastDist = '';
var theid = '';
var objSchoolInDist = {};
var objDistricts = {};

async function sendit(body, district){
       request({
            url: "https://api.jsonbin.io/b",
            method: "POST",
             headers: {
              'content-type': 'application/json', 
              'Accept-Charset': 'utf-8',
              'secret-key': context.secrets.jsonbinkey 
              },
            json: true,   // <--Very important!!!
            body: body
        }, function (error, response, body){
         //   console.log(body.id);
            
            objSchoolInDist[body.id] = district;
         //   console.log(objSchoolInDist);

            return;
         });
    
}

var i = 0;

csv
 .fromStream(req)
 .on("data", function(data){
    if (i > 3 ) {
    arrstr = data.toString("utf-8").split(',');
    if (arrDistrict.indexOf(arrstr[0]) === -1) {
        if (strLastDist !== arrstr[0]) {
            if (strLastDist === ''){
                strLastDist = arrstr[0]; 
            } else {
//            let results = await Promise.all([
  //          sendit(arrSchool, strLastDist);
  console.log('********'+strLastDist);
            objDistricts[strLastDist] = arrSchool;
            arrSchool = []; 
            arrDistrict.push(strLastDist);
            strLastDist = arrstr[0];
            }
        }
        arrDistrict.push(arrstr[0]);
    }
    arrSchool.push(arrstr[1]);
//    console.log(arrSchool);

    // objResult.school = arrstr[1];
    // if (objResult.school) {
    //     arrResults.push(objResult);
    // }
    }
    i++;
 })
 .on("end", function(){
  // sendit(arrDistrict);
  //  console.log('on end >>>>>>>>>>>>>>');
  //  console.dir(objDistricts);
   // sendit(objSchoolInDist);
    res.writeHead(200, { 'Content-Type': 'text/html '});
    res.end('<h1>file uploaded!</h1>' );

 });

};
