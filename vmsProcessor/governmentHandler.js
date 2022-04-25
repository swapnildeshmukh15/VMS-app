// write discription about context in each function
// context  Stores information about the current state of T.P , Also it
//  Provides the instance of current state
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const crypto = require('crypto');
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')

/**
 * @dev Transaction Family
 */
const FAMILY_NAME = 'Government';
const NAMESPACE = hash(FAMILY_NAME).substring(0, 6);

var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')

/**
 * @title hash
 * @dev function to hash a data
 * @param {*} v is the input given for hashing 
 */
function hash(v) {
    return crypto.createHash('sha512').update(v).digest('hex');
}

/**
 * @title VehicleDataAddress
 * @notice function to generate the address in which Government vehicle details is stored,when 
 * private key and vin number is given as input parameters 
 * @dev Here the address is created based on Transaction Family "Government"
 * @dev The addressing scheme is " FamilyName + Vin+ PublicKey Of Government Department"
 * @param {*} vin is the unique Vehicle Identification Number
 * @param {*} publicKeyHex User Public Key
 */
function VehicleDataAddress(vin, publicKeyHex) {
    let keyHash = hash(publicKeyHex)
    let nameHash = hash("Government")
    let vinHash = hash(vin)
    return nameHash.slice(0, 6) + vinHash.slice(0, 6) + keyHash.slice(0, 58)
}

/**
 * @title writeToStore
 * @dev function to write the data to the state
 * @param {*} context Provides the instance of current state
 * @param {*} address Address to which the data is written
 * @param {*} msg is the data that is written in state
 */
function writeToStore(context, address, msg) {
    /**
     * @dev Adding Custom Event Government/WordMatch
     * @dev Here Key is "department" and the match string is "police" 
     * It is mentioned in EventListner file 
     */
    let msg_eve = msg[1];
    let msg_eve_lower = msg_eve.toLowerCase(); 
    let msgB = encoder.encode(msg_eve_lower)
    attribute = [['department', msg_eve_lower.toString()]]
    context.addEvent('Government/WordMatch', attribute, msgB)
    /**
     * @dev Adding Some Data in Transaction Receipt 
     */
    context.addReceiptData(Buffer.from("New Government Vehicle Data Entered...", 'utf8'));
    /**
     * @dev encoding the data to be written in state and writing it in state
     */
    msgBytes = encoder.encode(msg)
    let enteries = {
        [address]: msgBytes
    }
    return context.setState(enteries);
}

/**
 * @title registration
 * @dev function to register the details of Government vehicle
 * @param {*} context the instance of current state
 * @param {*} vin Unique vehicle identification number 
 * @param {*} department department of government
 * @param {*} model model of vehicle
 * @param {*} date date of registration
 * @param {*} sign public key of the transaction signer (transactor)
 */
function registration(context, vin, department, model, date, sign) {
    let vehicle_Address = VehicleDataAddress(vin, sign)
    let vehicle_detail = [vin, department, model, date]
    /**
     * @dev Adding data to the transaction Receipt 
     */
    context.addReceiptData(Buffer.from("New Government Vehicle of VIN No : " + vin + " Registering..........", 'utf8'));
    return writeToStore(context, vehicle_Address, vehicle_detail)
}

/**
 * @title deleteData1
 * @dev function to delete the Government vehicle details
 * @param {*} context the instance of current state
 * @param {*} vin vin of vehicle
 * @param {*} sign public key of the transaction signer
 */
function deleteData1(context, vin, sign) {
    console.log(" vin " + vin);
    console.log(" sign " + sign);
    let vehicle_Address = VehicleDataAddress(vin, sign)
    console.log("Vehicle Details Address " + vehicle_Address)
    console.log("data deletion progressing");
    return context.getState([vehicle_Address]).then(function (data) {
        console.log("data", data)
        if (data[vehicle_Address] == null || data[vehicle_Address] == "" || data[vehicle_Address] == []) {
            throw new InvalidTransaction("No such state exists to delete details")
        }
        else {
            /**
              * @dev Adding Data to the Transaction Receipt about Deletion of vehicle 
              */
            context.addReceiptData(Buffer.from("Deleting Data of Vehicle with VIN NO : " + vin, 'utf8'));
            return context.deleteState([vehicle_Address])
        }
    })
}

/**
 * @dev class
 */
class GovernmentHandler extends TransactionHandler {
    constructor() {
        super(FAMILY_NAME, ['1.0'], [NAMESPACE]);
    }
    /**
     * @title apply
     * @param {*} transactionProcessRequest Contains the Valid Transaction From Client
     * @param {*} context  instance of current state
     */
    apply(transactionProcessRequest, context) {
        /**
         * @dev Payload is obtained from transactionProcessRequest and decoded
         */
        let payloadBytes = decoder.decode(transactionProcessRequest.payload)
        console.log("payloadbytes ", payloadBytes);
        /**
         * @dev Here the public key of the transaction signer is obtained from header and 
         * stored in "sign"
         */
        let sign = transactionProcessRequest.header.signerPublicKey
        console.log("signing public key " + sign);
    
        let payload = payloadBytes.toString().split(',')
        console.log("payload", payload);
        let action = payload[0];
        console.log("action", action);
        /**
         * @dev function call is based on action
         */
        if (action === "Add Government Registration") {
            return registration(context, payload[2], payload[3], payload[4], payload[5], sign)
        }
        else if (action === "Delete State") {
            return deleteData1(context, payload[2], sign)
        }

        else if (action === " ") {
            throw new InvalidTransaction("Action is Required")
        }
    }
}
module.exports = GovernmentHandler;

