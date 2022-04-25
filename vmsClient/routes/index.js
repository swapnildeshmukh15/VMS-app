var express = require('express');
var bodyParser = require('body-parser');
var { UserClient } = require('./UserClient')
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('Home', { title: 'Vehicle Management System' });
});

/* GET home page. */
router.get('/home', function (req, res, next) {
  res.render('Home', { title: 'Vehicle Management System' });
});

/* GET Vehicle Registration page. */
router.get('/registration', (req, res) => {
  res.render('Registration');
});

/* GET Vehicle Insurance page. */
router.get('/insurance', (req, res) => {
  res.render('Insurance');
});

/* GET Vehicle Pollution page. */
router.get('/pollution', (req, res) => {
  res.render('Pollution');
});

/* GET Vehicle Traffic Police Complaint Register page. */
router.get('/police', (req, res) => {
  res.render('Police');
});

/* GET  Government Vehicle Registration page. */
router.get('/government', (req, res) => {
  res.render('government');
});

/* GET Vehicle Details page. */
router.get('/state', (req, res) => {
  res.render('Details');
});

/* GET Government Vehicle Details page. */
router.get('/state1', (req, res) => {
  res.render('Details1');
});

/* GET Vehicle Deletion page. */
router.get('/delete', (req, res) => {
  res.render('Delete');
});

/* GET Government Vehicle Deletion page. */
router.get('/delete1', (req, res) => {
  res.render('Delete1');
});

/* GET Transaction Receipts page. */
router.get('/transactionReceipts', (req, res) => {
  res.render('TransactionReceipts');
});

/* GET Latest Transaction's ID Display page. */
router.get('/transactionID', (req, res) => {
  res.render('TransactionID');
});

/**
 * @title addRegistration
 * @dev  Function to register the details of the Registration of vehicle 
 */
router.post('/registration', async function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  var data3 = req.body.write3;
  var data4 = req.body.write4;
  var data5 = req.body.write5;
  var data6 = req.body.write6;
  console.log("Data sent to REST API");
  var client = new UserClient();
  let clientExist = await client.addRegistration("Registration", data1, data2, data3, data4, data5, data6);
  if (clientExist == 1) {
    res.send({ message: "Registration of VIN NO: " + data2 + " done Data successfully added" });
  }
  else if (clientExist == 0) {
    res.send({ message: "Registration Already Exist" });
  }
})

/**
 * @title addInsurance
 * @dev  Function to add the details of the Insurance of vehicle 
 */
router.post('/insurance', async function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  var data3 = req.body.write3;
  var data4 = req.body.write4;
  var data5 = req.body.write5;
  console.log("Data sent to REST API");
  var client = new UserClient();
  let clientExist = await client.addInsurance("Insurance", data1, data2, data3, data4, data5)
  if (clientExist == 1) {
    res.send({ message: "Insurance of VIN NO: " + data2 + " done and Data successfully added" });
  }
  else if (clientExist == 0) {
    res.send({ message: "Insurance Already Exists" });
  }
})

/**
 * @title addPollution
 * @dev  Function to add the details of the Pollution of vehicle 
 */
router.post('/pollution', async function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  var data3 = req.body.write3;
  var data4 = req.body.write4;
  var data5 = req.body.write5;
  console.log("Data sent to REST API");
  var client = new UserClient();
  let clientExist = await client.addPollution("Pollution", data1, data2, data3, data4, data5)
  if (clientExist == 1) {
    res.send({ message: "Pollution of VIN NO: " + data2 + " done and Data successfully added" });
  }
  else if (clientExist == 0) {
    res.send({ message: "Pollution Already Exists" });
  }
})

/**
 * @title addPolice
 * @dev  Function to add the details of the Traffic Violations of vehicle 
 */
router.post('/police', function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  var data3 = req.body.write3;
  var data4 = req.body.write4;
  console.log("Data sent to REST API");
  var client = new UserClient();
  client.addPolice("Police", data1, data2, data3, data4)
  res.send({ message: "Data successfully added" });
})

/**
 * @title addGovernmentRegistration
 * @dev  Function to register the details of the Registration of Government vehicle 
 */
router.post('/government', async function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  var data3 = req.body.write3;
  var data4 = req.body.write4;
  var data5 = req.body.write5;
  console.log("Data sent to REST API");
  var client = new UserClient();
  let clientExist = await client.addGovernmentRegistration("Government_Registration", data1, data2, data3, data4, data5);
  if (clientExist == 1) {
    res.send({ message: "Government Vehicle Registration  of VIN NO: " + data2 + " done and Data successfully added" });
  }
  else if (clientExist == 0) {
    res.send({ message: "Government Vehicle Registration Already Exists" });
  }
})

/**
 * @title result
 * @dev  Function to view the details of the vehicle 
 */
router.post('/state', async function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  console.log(data1 + " data1 from index");
  console.log(data2 + " data2 from index");
  var client = new UserClient();
  var getData = await client.result(data1, data2);
  console.log("Data got from REST API", getData);
  if (getData == 1) {
    res.send({ balance: "There is no Data in the Queried state address" });
  }
  else {
    res.send({ balance: getData });
  }
})

/**
 * @title result1
 * @dev  Function to view the details of the Government vehicle 
 */
router.post('/state1', async function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  console.log(data1 + " data1 from index");
  console.log(data2 + " data2 from index");
  var client = new UserClient();
  var getData = await client.result1(data1, data2);
  console.log("Data got from REST API", getData);
  if (getData == 1) {
    res.send({ balance: "There is no Data in the Queried state address" });
  }
  else {
    res.send({ balance: getData });
  }
})

/**
 * @title deleteData
 * @dev  Function to delete the details of the vehicle 
 */
router.post('/delete', async function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  console.log(data1 + " data1 from index");
  console.log(data2 + " data2 from index");
  var client = new UserClient();
  let clientExist = await client.deleteData("deleteState", data1, data2)
  if (clientExist == 1) {
    res.send({ message: "Vehicle of VIN NO: " + data2 + " deleted successfully " });
  }
  else if (clientExist == 0) {
    res.send({ message: "Vehicle of VIN NO: " + data2 + " Does not Exist " });
  }
})

/**
 * @title deleteData1
 * @dev  Function to delete the details of the Government vehicle 
 */
router.post('/delete1', async function (req, res) {
  var data1 = req.body.write1;
  var data2 = req.body.write2;
  console.log(data1 + " data1 from index");
  console.log(data2 + " data2 from index");
  var client = new UserClient();
  let clientExist = await client.deleteData1("deleteState", data1, data2)
  if (clientExist == 1) {
    res.send({ message: "Vehicle of VIN NO: " + data2 + " deleted successfully " });
  }
  else if (clientExist == 0) {
    res.send({ message: "Vehicle of VIN NO: " + data2 + " Does not Exist " });
  }
})

/**
 * @title transactionReceipt
 * @dev  Function to Display the Transaction Receipt Data when Transaction ID is given
 */
router.post('/transactionReceipts', async function (req, res) {
  var data1 = req.body.write1;
  console.log(data1 + " data1 from index");
  var client = new UserClient();
  var getData = await client.transactionReceipt(data1);
  console.log("Data got from REST API", getData);
  if (getData == 1) {
    res.send({ balance: "There is no Receipt Data For This Transaction ID" });
  }
  else {
    res.send({ balance: getData });
  }
})

/**
 * @title transactionID
 * @dev  Function to Display the Latest Transaction's ID
 */
router.post('/transactionID', async function (req, res) {
  var client = new UserClient();
  var getData = await client.transactionID();
  console.log("Data got from REST API", getData);
  if (getData == 1) {
    res.send({ balance: "There is no Transaction ID " });
  }
  else {
    res.send({ balance: getData });
  }
})

module.exports = router;
