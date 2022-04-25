
const crypto = require('crypto');
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const http = require('http');
const fs = require('fs')
const fetch = require('node-fetch');
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')

var encoder = new TextEncoder('utf8');
var decoder = new TextDecoder('utf8')

/**
 * @title hash
 * @notice function to hash a data
 * @param {*} data is the input given for hashing 
 */
function hash(data) {
  return crypto.createHash('sha512').update(data).digest('hex');
}

/**
 * @title VehicleAddress
 * @notice function to generate the address in which vehicle details is stored,when 
 * private key and vin number is given as input parameters 
 * @dev Here the address is created based on Transaction Family "Vehicle"  
 * @dev The addressing scheme is " FamilyName + Vin+ PublicKey Of Concern Department" 
 * @param {*} priv is the private Key 
 * @param {*} vin is the Vehicle Identification Number
 */
function VehicleAddress(priv, vin) {
  const context = createContext('secp256k1');
  let key = Secp256k1PrivateKey.fromHex(priv)
  let signer = new CryptoFactory(context).newSigner(key);
  let publicKeyHex = signer.getPublicKey().asHex()
  let keyHash = hash(publicKeyHex)
  let nameHash = hash("Vehicle")
  let vinHash = hash(vin)
  return nameHash.slice(0, 6) + vinHash.slice(0, 6) + keyHash.slice(0, 58)
}

/**
 * @title VehicleAddress1
 * @notice function to generate the address in which vehicle details is stored,when 
 * private key and vin number is given as input parameters 
 * @dev Here the address is created based on Transaction Family "Government"  
 * @dev The addressing scheme is " FamilyName + Vin+ PublicKey Of Government Department"
 * @param {*} priv User private Key 
 * @param {*} vin is the unique Vehicle Identification Number 
 */
function VehicleAddress1(priv, vin) {
  const context = createContext('secp256k1');
  let key = Secp256k1PrivateKey.fromHex(priv)
  let signer = new CryptoFactory(context).newSigner(key);
  let publicKeyHex = signer.getPublicKey().asHex()
  let keyHash = hash(publicKeyHex)
  let nameHash = hash("Government")
  let vinHash = hash(vin)
  return nameHash.slice(0, 6) + vinHash.slice(0, 6) + keyHash.slice(0, 58)
}

/**
 * @title createTransaction
 * @notice Function to create a batch with One transaction
 * @dev The batch has only one transaction
 * @param {*} familyName Transaction Family Name
 * @param {*} inputAddressList List of Input Addresses
 * @param {*} outputAddressList List of Output Addresses
 * @param {*} Privkey User Private Key 
 * @param {*} payload Payload
 * @param {*} familyVersion Version Of Transaction Family
 */
function createTransaction(familyName, inputAddressList, outputAddressList, Privkey, payload, familyVersion = '1.0') {
  const privateKeyHex = Privkey
  const context = createContext('secp256k1');
  const secp256k1pk = Secp256k1PrivateKey.fromHex(privateKeyHex.trim());
  signer = new CryptoFactory(context).newSigner(secp256k1pk);
  /**
   * Encoding The payload
   */
  const payloadBytes = encoder.encode(payload)
  /**
   * Creating Transaction header
   */
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: familyName,
    familyVersion: familyVersion,
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes),
  }).finish();
  /**
   * Creating Transaction
   */
  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signer.sign(transactionHeaderBytes),
    payload: payloadBytes
  });
  const transactions = [transaction];
  /**
   * Creating Batch header
   */
  const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
  }).finish();
  const batchSignature = signer.sign(batchHeaderBytes);
  /**
   * Creating Batch
   */
  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions,
  });
  /**
   * Creating Batchlist
   */
  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish();
  /**
   * Sending encoded batchlist to the validator through restapi
   */
  sendTransaction(batchListBytes);
}

/**
 * @title makeTransaction
 * @notice Function to create a batch with Four transaction
 * @dev The batch has Four Transactions 
 * @param {*} familyName Transaction Family Name
 * @param {*} inputAddressList List of Input Addresses
 * @param {*} outputAddressList List of Output Addresses
 * @param {*} Privkey User Private Key 
 * @param {*} payload Payload
 * @param {*} familyVersion Version Of Transaction Family
 */
function makeTransaction(familyName, inputAddressList, outputAddressList, Privkey, payload1, payload2, payload3, payload4, familyVersion = '1.0') {
  const privateKeyHex = Privkey
  const context = createContext('secp256k1');
  const secp256k1pk = Secp256k1PrivateKey.fromHex(privateKeyHex.trim());
  signer = new CryptoFactory(context).newSigner(secp256k1pk);
  /**
   * Encoding The payloads
   */
  const payloadBytes1 = encoder.encode(payload1)
  const payloadBytes2 = encoder.encode(payload2)
  const payloadBytes3 = encoder.encode(payload3)
  const payloadBytes4 = encoder.encode(payload4)
  /**
   * Creating Transaction header for Transaction1
   */
  const transactionHeaderBytes1 = protobuf.TransactionHeader.encode({
    familyName: familyName,
    familyVersion: familyVersion,
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes1),
  }).finish();
  /**
   * Creating Transaction header for Transaction2
   */
  const transactionHeaderBytes2 = protobuf.TransactionHeader.encode({
    familyName: familyName,
    familyVersion: familyVersion,
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes2),
  }).finish();
  /**
   * Creating Transaction header for Transaction3
   */
  const transactionHeaderBytes3 = protobuf.TransactionHeader.encode({
    familyName: familyName,
    familyVersion: familyVersion,
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes3),
  }).finish();
  /**
   * Creating Transaction header for Transaction4
   */
  const transactionHeaderBytes4 = protobuf.TransactionHeader.encode({
    familyName: familyName,
    familyVersion: familyVersion,
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes4),
  }).finish();
  /**
   * Creating Transaction 1
   */
  const transaction1 = protobuf.Transaction.create({
    header: transactionHeaderBytes1,
    headerSignature: signer.sign(transactionHeaderBytes1),
    payload: payloadBytes1
  });
  /**
   * Creating Transaction 2
   */
  const transaction2 = protobuf.Transaction.create({
    header: transactionHeaderBytes2,
    headerSignature: signer.sign(transactionHeaderBytes2),
    payload: payloadBytes2
  });
  /**
   * Creating Transaction 3
   */
  const transaction3 = protobuf.Transaction.create({
    header: transactionHeaderBytes3,
    headerSignature: signer.sign(transactionHeaderBytes3),
    payload: payloadBytes3
  });
  /**
   * Creating Transaction 4
   */
  const transaction4 = protobuf.Transaction.create({
    header: transactionHeaderBytes4,
    headerSignature: signer.sign(transactionHeaderBytes4),
    payload: payloadBytes4
  });
  /**
   * Combining All transactions
   */
  const transactions = [transaction1, transaction2, transaction3, transaction4];
  /**
   * Creating Batch header
   */
  const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
  }).finish();
  const batchSignature = signer.sign(batchHeaderBytes);
  /**
   * Creating Batch
   */
  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions,
  });
  /**
   * Creating Batchlist
   */
  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish();
  /**
   * Sending encoded batchlist to the validator through restapi
   */
  sendTransaction(batchListBytes);
}

/**
 * @title sendTransaction
 * @notice function to submit the batchListBytes to validator through rest-api port 8008
 * @param {*} batchListBytes Encoded batchlist containg the transactions
 */
async function sendTransaction(batchListBytes) {
  let resp = await fetch('http://rest-api:8008/batches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: batchListBytes
  })
  console.log("response", resp);
}

/**
 * Transaction Family names 
 */
FAMILY_NAME = 'Vehicle'
FAMILY_NAME1 = 'Government'

/**
 * Class  
 */
class UserClient {

  /**
   * @title addRegistration
   * @dev Function to register the details of the Registration of vehicle
   * @param {*} registration Identification string
   * @param {*} data1 Private Key Of the User
   * @param {*} data2 Vin of the Vehicle
   * @param {*} data3 Vehicle Engine Number
   * @param {*} data4 Vehicle Model
   * @param {*} data5 Date of Registration
   */
  async addRegistration(registration, data1, data2, data3, data4, data5, data6) {
    let address = VehicleAddress(data1, data2)
    let action = "Add Registration"
    let payload = [action, registration, data2, data3, data4, data5, data6].join(',')
    let vehicleExistAddress = 'http://rest-api:8008/state/' + address;
    let vehicleCheck = await fetch(vehicleExistAddress);
    console.log(vehicleCheck, "vehicle check ")
    let vehicleCheckJSON = await vehicleCheck.json();
    console.log(vehicleCheckJSON.data, "vehicle check json data");
    let registrationFlag = 0;
    if (vehicleCheckJSON.data == "" || vehicleCheckJSON.data == null) {
      console.log(vehicleCheckJSON, "vehicle check json");
      registrationFlag = 1;
      await createTransaction(FAMILY_NAME, [address], [address], data1, payload)
    }
    else {
      console.log('Registration Already  Exist in this VIN NO:')
    }
    return registrationFlag
  }

  /**
   * @title addInsurance
   * @dev Function to add the details of the Insurance of vehicle
   * @param {*} insurance Identification String
   * @param {*} data1 Private Key of the User
   * @param {*} data2 Vin of the Vehicle 
   * @param {*} data3 Insurance Amount
   * @param {*} data4 Insurance Company
   * @param {*} data5 Date of Payment
   */
  async addInsurance(insurance, data1, data2, data3, data4, data5) {
    let action = "Add Insurance"
    let address = VehicleAddress(data1, data2)
    let payload = [action, insurance, data2, data3, data4, data5].join(',')
    let vehicleExistAddress = 'http://rest-api:8008/state/' + address;
    let vehicleCheck = await fetch(vehicleExistAddress);
    console.log(vehicleCheck, "vehicle check ")
    let vehicleCheckJSON = await vehicleCheck.json();
    console.log(vehicleCheckJSON.data, "vehicle check json data");
    let insuranceFlag = 0;
    if (vehicleCheckJSON.data == "" || vehicleCheckJSON.data == null) {
      console.log(vehicleCheckJSON, "vehicle check json");
      insuranceFlag = 1;
      await createTransaction(FAMILY_NAME, [address], [address], data1, payload)
    }
    else {
      console.log('Insurance Already  Exist in this VIN NO:')
    }
    return insuranceFlag
  }

  /**
   * @title addPollution
   * @dev Function to add the details of the Pollution of vehicle
   * @param {*} pollution Identification string
   * @param {*} data1 Private Key Of User
   * @param {*} data2 Vin Of the Vehicle
   * @param {*} data3 Pollution Amount
   * @param {*} data4 Pollution company
   * @param {*} data5 Date of Payment
   */
  async addPollution(pollution, data1, data2, data3, data4, data5) {
    let action = "Add Pollution"
    let address = VehicleAddress(data1, data2)
    let payload = [action, pollution, data2, data3, data4, data5].join(',')
    let vehicleExistAddress = 'http://rest-api:8008/state/' + address;
    let vehicleCheck = await fetch(vehicleExistAddress);
    console.log(vehicleCheck, "vehicle check ")
    let vehicleCheckJSON = await vehicleCheck.json();
    console.log(vehicleCheckJSON.data, "vehicle check json data");
    let pollutionFlag = 0;
    if (vehicleCheckJSON.data == "" || vehicleCheckJSON.data == null) {
      console.log(vehicleCheckJSON, "vehicle check json");
      pollutionFlag = 1;
      await createTransaction(FAMILY_NAME, [address], [address], data1, payload)
    }
    else {
      console.log('Pollution Already  Exist in this VIN NO:')
    }
    return pollutionFlag
  }

  /**
   * @title addPolice
   * @dev Function to add the details of the Traffic Violations of vehicle
   * @dev Here Whether Address is Existing is not checked because in case of police
   * we are appending the number of complaint's to each vehicle
   * @param {*} police Identification String
   * @param {*} data1 Private Key of User
   * @param {*} data2 Vin Of Vehicle
   * @param {*} data3 Complaint Number
   * @param {*} data4 Date of Complaint 
   */
  async addPolice(police, data1, data2, data3, data4) {
    let action = "Add Police"
    let Address = VehicleAddress(data1, data2)
    let payload = [action, police, data2, data3, data4].join(',')
    if (data1 != "" || data1 != null) {
      createTransaction(FAMILY_NAME, [Address], [Address], data1, payload)
    }
    else {
      console.log('Police Not Authorised')
    }
  }

  /**
   * @title addGovernmentRegistration
   * @dev Function to register the details of the Registration of Government vehicle 
   * @dev Here we are sending Four payload's and the Data In the Final Payload is used to write in state
   * This is done just to demonstrate that multiple transactions can be sent in a batch
   * @param {*} Government_Registration Identification String
   * @param {*} data1 Private Key Of User
   * @param {*} data2 Vin Of Vehicle
   * @param {*} data3 Department Of Government
   * @param {*} data4 Model of Vehicle
   * @param {*} data5 Date of Registration
   */
  async addGovernmentRegistration(Government_Registration, data1, data2, data3, data4, data5) {
    let address = VehicleAddress1(data1, data2)
    let action = "Add Government Registration"
    let payload1 = [action, Government_Registration, data2, Government_Registration, Government_Registration, Government_Registration].join(',')
    let payload2 = [action, Government_Registration, data2, Government_Registration, Government_Registration, Government_Registration].join(',')
    let payload3 = [action, Government_Registration, data2, Government_Registration, Government_Registration, Government_Registration].join(',')
    let payload4 = [action, Government_Registration, data2, data3, data4, data5].join(',')
    let vehicleExistAddress = 'http://rest-api:8008/state/' + address;
    let vehicleCheck = await fetch(vehicleExistAddress);
    console.log(vehicleCheck, "vehicle check ")
    let vehicleCheckJSON = await vehicleCheck.json();
    console.log(vehicleCheckJSON.data, "vehicle check json data");
    let governmentFlag = 0;
    if (vehicleCheckJSON.data == "" || vehicleCheckJSON.data == null) {
      console.log(vehicleCheckJSON, "vehicle check json");
      governmentFlag = 1;
      await makeTransaction(FAMILY_NAME1, [address], [address], data1, payload1, payload2, payload3, payload4)
    }
    else {
      console.log('Government Registration Already  Exist in this VIN NO:')
    }
    return governmentFlag
  }

  /**
   * @title deleteData
   * @dev Function to delete the details of the vehicle
   * @param {*} deleteState Identification String
   * @param {*} data1 User Private Key
   * @param {*} data2 Vin of Vehicle
   */
  async deleteData(deleteState, data1, data2) {
    let action = "Delete State"
    let address = VehicleAddress(data1, data2)
    let payload = [action, deleteState, data2].join(',')
    let vehicleExistAddress = 'http://rest-api:8008/state/' + address;
    let vehicleCheck = await fetch(vehicleExistAddress);
    console.log(vehicleCheck, "vehicle check ")
    let vehicleCheckJSON = await vehicleCheck.json();
    console.log(vehicleCheckJSON.data, "vehicle check json data");
    let deleteFlag = 0;
    if (vehicleCheckJSON.data != "" || vehicleCheckJSON.data != null) {
      console.log(vehicleCheckJSON, "vehicle check json");
      deleteFlag = 1;
      await createTransaction(FAMILY_NAME, [address], [address], data1, payload)
    }
    else {
      console.log('Vehicle Does Not Exist in this VIN NO:')
    }
    return deleteFlag
  }

  /**
   * @title deleteData1
   * @dev Function to delete the details of the Government vehicle 
   * @param {*} deleteState Identification string
   * @param {*} data1 User Private Key
   * @param {*} data2 vin Of Vehicle
   */
  async deleteData1(deleteState, data1, data2) {
    let action = "Delete State"
    let address = VehicleAddress1(data1, data2)
    let payload = [action, deleteState, data2].join(',')

    let vehicleExistAddress = 'http://rest-api:8008/state/' + address;
    let vehicleCheck = await fetch(vehicleExistAddress);
    console.log(vehicleCheck, "vehicle check ")
    let vehicleCheckJSON = await vehicleCheck.json();
    console.log(vehicleCheckJSON.data, "vehicle check json data");
    let deleteFlag = 0;
    if (vehicleCheckJSON.data != "" || vehicleCheckJSON.data != null) {
      console.log(vehicleCheckJSON, "vehicle check json");
      deleteFlag = 1;
      await createTransaction(FAMILY_NAME1, [address], [address], data1, payload)
    }
    else {
      console.log('Government Vehicle Does Not Exist in this VIN NO:')
    }
    return deleteFlag
  }


  /**
   * @title result
   * @dev Function to view the details of the vehicle 
   * @param {*} data1 User Private Key
   * @param {*} data2 Vin Of Vehicle
   */
  async result(data1, data2) {
    console.log("result...Private Key and Vin...from UserClient " + data1, data2);
    let address = VehicleAddress(data1, data2)
    console.log("result (address) from UserClient " + address);
    if (data1 != " " || data1 != null) {
      console.log("Going to fetch Data From Address ");
      var geturl = 'http://rest-api:8008/state/' + address
      console.log("Getting from: " + geturl);
      let response = await fetch(geturl, {
        method: 'GET',
      })
      console.log(response);
      let responseJson = await response.json();
      console.log(responseJson);
      var data = responseJson.data;
      console.log(data + " data obtained from State Address");
      if (data == undefined) {
        console.log("Data Obtained is Undefined");
        var newdata1 = 1;
        return newdata1
      }
      else {
        var newdata = Buffer.from(data, 'base64').toString();
        console.log("Data Obtained from state successfully and is " + newdata);
        return newdata;
      }
    }
    else {
      console.log('Enter valid private key and vin no:')
    }
  }


  /**
   * @title result1
   * @dev Function to view the details of the Government vehicle
   * @param {*} data1 
   * @param {*} data2 
   */
  async result1(data1, data2) {
    console.log("result...Private Key and Vin...from UserClient " + data1, data2);
    let address = VehicleAddress1(data1, data2)
    console.log("result (address) from UserClient " + address);
    if (data1 != " " || data1 != null) {
      console.log("Going to fetch Data From Address ");
      var geturl = 'http://rest-api:8008/state/' + address
      console.log("Getting from: " + geturl);
      let response = await fetch(geturl, {
        method: 'GET',
      })
      console.log(response);
      let responseJson = await response.json();
      console.log(responseJson);
      var data = responseJson.data;
      console.log(data + "data obtained from State Address");
      if (data == undefined) {
        console.log("Data Obtained is Undefined");
        var newdata1 = 1;
        return newdata1
      } else {
        var newdata = Buffer.from(data, 'base64').toString();
        console.log("Data Obtained from state successfully and is returning... " + newdata);
        return newdata;
      }
    }
    else {
      console.log('Enter valid private key and vin no:')
    }
  }

  /**
   * @title transactionReceipt
   * @dev Function to Display the Transaction Receipt Data when Transaction ID is given
   * @param {*} data1 Transaction Id
   */
  async transactionReceipt(data1) {
    console.log("transactionID from UserClient" + data1);
    if (data1 != " " || data1 != null) {
      var getTransactionReceipt = 'http://rest-api:8008/receipts?id=' + data1
      console.log("Getting from: " + getTransactionReceipt);
      let response = await fetch(getTransactionReceipt, {
        method: 'GET',
      })
      console.log(response);
      let responseJson = await response.json();
      console.log("Response Json Obtained " + responseJson);
      // var data = JSON.stringify(responseJson);
      var responseData1 = responseJson.data[0].data[0];
      var responseData2 = responseJson.data[0].data[1];
      console.log(responseData1 + " responsedata1");
      console.log(responseData2 + " responsedata2");
      if (responseData1 == undefined) {
        console.log("responseData1 is Undefined ");
        var newdata1 = 1;
        return newdata1
      }
      else if (responseData2 == undefined) {
        console.log("responseData2 is undefined but got responseData1 ");
        var newdata = Buffer.from(responseData1, 'base64').toString();
        console.log("newdata returning..." + newdata);
        return newdata;
      }
      else {
        console.log("Got responseData1 and responseData2 ");
        var newdata1 = Buffer.from(responseData1, 'base64').toString();
        var newdata2 = Buffer.from(responseData2, 'base64').toString();
        console.log("newdata1 is returning..." + newdata1);
        console.log("newdata2 is returning..." + newdata2);
        var newdata = newdata1 + newdata2;
        return newdata;
      }
    }
  }

  /**
   * @title transactionID
   * @dev Function to Display the Latest Transaction's ID
   */
  async transactionID() {
    var getTransactionList = 'http://rest-api:8008/blocks'
    console.log("Getting from: " + getTransactionList);
    let response = await fetch(getTransactionList, {
      method: 'GET',
    })
    console.log(response);
    let responseJson = await response.json();
    console.log(responseJson);
    var data = responseJson.data[0].batches[0].header.transaction_ids;
    var dataList = JSON.stringify(data);
    console.log("Response Data listing Latest Transaction Id " + data);
    console.log("String of Transaction Id " + dataList);
    if (dataList == undefined) {
      console.log("Obtained Undefined Data");
      var newdata1 = 1;
      return newdata1
    } else {
      console.log("Obtained transaction Id ");
      var newdata = dataList;
      console.log("Returning Transaction Id " + newdata);
      return newdata;
    }
  }


}
module.exports = { UserClient };











