var express = require('express');
var router = express.Router();
const queue = require('../store/queue');
var fs = require('fs');

router.post('/', function(req, res, next) {
  var file = req.body.postman;
  console.log(req.body.postman);
  fs.writeFile("collections/graphman.json", file, function(err) {
    if(err) {
        return console.log(err);
    }


    console.log("The file was saved!");
  });

  const jobData = {
    "file_url" : file,
    "env_url" : ""
  }

  const job = queue.createJob(jobData);
  job.timeout(10000);
  job.save();

  job.on('succeeded', (result) => {
    if(result.success == true){
      res.send({"success": true, "result" : result.result});
    }else{
      res.send({"success" : false, "result" : ""});
    }
  });
  job.on('failed', (err) => {
      res.send({"success" : false,"result" : ""});
  });

  //res.send('respond with a resource');
});

module.exports = router;
