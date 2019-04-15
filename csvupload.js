const formidable = require('formidable-memory');
const csv = require('fast-csv');
const request = require('request-promise');

module.exports = function (context, req, res) {
var arrstr = [];
var arrSchool = [];
var districts = [];
var strLastDist = '';
var theid = '';
var objSchoolInDist = {};
var objDistricts = {};

async function sendit(body){
       return await request({
            url: "https://api.jsonbin.io/b",
            method: "POST",
             headers: {
              'content-type': 'application/json', 
              'Accept-Charset': 'utf-8',
              'secret-key': context.secrets.jsonbinkey 
              },
            json: true,   // <--Very important!!!
            body: body
        });   
}

var i = 0;

csv
 .fromStream(req)
 .on("data", function(data){
    if (i > 3 ) {
    arrstr = data.toString("utf-8").split(',');
    if (districts.indexOf(arrstr[0]) === -1) {
        if (strLastDist !== arrstr[0]) {
            if (strLastDist === ''){
                strLastDist = arrstr[0]; 
            } else {
            objDistricts[strLastDist] = arrSchool;
            arrSchool = []; 
            strLastDist = arrstr[0];
            }
        }
        districts.push(arrstr[0]);
    }
    var objsch = {};
    objsch[arrstr[1]] = arrstr[1];
    arrSchool.push(`${arrstr[1]}`+'":"'+`${arrstr[1]}`);
    }
    i++;
 })
 .on("end", async function(){
    console.log('on end >>>>>>>>>>>>>>');
    var objNew = {};
    var guid = '';
    var allresults = await Promise.all(
          Object.keys(objDistricts).map(async (key, index) => {
              try {
                let response = await sendit(objDistricts[key]); 
                objNew[key]= response.id;
                }
                catch(err) {
                    console.log('Got an error:', err.message)
                }
        }))
   console.dir(objNew);
    sendit(objNew);
    res.writeHead(200, { 'Content-Type': 'text/html '});
    res.end('<h1>file uploaded!</h1>' );
 });

};