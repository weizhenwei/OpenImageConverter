
var express = require('express');
var router = express.Router();
var fs = require("fs");
 
var bodyParser = require('body-parser');
var multer  = require('multer');
 
router.use(express.static('public'));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(multer({ dest: '/tmp/'}).array('image'));
 
router.post('/file_upload', function (req, res) {
       console.log(req.files[0]);

       console.log("****************************cutting line****************");

       var des_file = __dirname + "/" + req.files[0].originalname;
       fs.readFile(req.files[0].path, function (err, data) {
           fs.writeFile(des_file, data, function (err) {
               if (err) {
                   console.log(err);
               } else {
                   response = {
                       message:'File uploaded successfully', filename:req.files[0].originalname };
               }

               console.log( response );
               res.end(JSON.stringify(response));
           });
       });
});
 

module.exports = router;

