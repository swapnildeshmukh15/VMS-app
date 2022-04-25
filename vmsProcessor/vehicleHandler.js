
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const crypto = require('crypto');
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')

/**
 * @dev Transaction Family
 */
const FAMILY_NAME = 'Vehicle';
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
 * @notice function to generate the address in which vehicle details is stored,when
 * private key and vin number is given as input parameters
 * @dev Here the address is created based on Transaction Family "Vehicle"
 * @dev The addressing scheme is " FamilyName + Vin+ PublicKey Of concern Department"
 * @param {*} vin  unique Vehicle Identification Number
 * @param {*} publicKeyHex User Public key
 */
function VehicleDataAddress(vin, publicKeyHex) {
    let keyHash = hash(publicKeyHex)
    let nameHash = hash("Vehicle")
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
     * @dev Adding Custom Event Vehicle/WordMatch
     * @dev Here Key is "model" and the match string is "bmw" 
     * It is mentioned in EventListner file 
     */
    let msg_eve = msg[2];
    let msg_eve_lower = msg_eve.toLowerCase();
    let msgB = encoder.encode(msg_eve_lower)
    attribute = [['model', msg_eve_lower.toString()]]
    context.addEvent('Vehicle/WordMatch', attribute, msgB)
    /**
     * @dev Adding Some Data in Transaction Receipt 
     */
    context.addReceiptData(Buffer.from("New Vehicle Data Entered successfully.............", 'utf8'));
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
 * @title writeToStorePolice
 * @dev function to write the data to the state
 * @dev Here in case of police,the data is appended to the existing data in address
 * @param {*} context the instance of current state
 * @param {*} address Address to which the data is written
 * @param {*} msg is the data that is written in state
 */
function writeToStorePolice(context, address, msg) {
    return context.getState([address]).then(function (stateKeyValueAddress) {
        console.log("state Address Value ", JSON.stringify(stateKeyValueAddress));
        var previous_data = 0;
        previous_data = stateKeyValueAddress[address];
        console.log('previous data= ', previous_data);
        if (previous_data == '' || previous_data == null) {
            console.log("No previous data,creating new data");
            /**
             * @dev Adding Some Data in Transaction Receipt
             */
            context.addReceiptData(Buffer.from("Initial Entry of Vehicle's Police Department Data successfully....", 'utf8'));
            /**
             * @dev if there is no existing data, encoding the data to be written in state and 
             * writing it in state 
             */
            let msgBytes = encoder.encode(msg);
            let entries = {
                [address]: msgBytes
            }
            return context.setState(entries);
        }
        else {
            /**
             * @dev Adding Some Data in Transaction Receipt
             */
            context.addReceiptData(Buffer.from("Vehicle's Police Department Data Entered successfully....", 'utf8'));
            /**
             * @dev If data already exists the new data is appended to the existing data
             */
            let message = previous_data + "---" + msg;
            let msgBytes = encoder.encode(message);
            console.log("message ", message);
            let entries = {
                [address]: msgBytes
            }
            return context.setState(entries);
        }
    })
}

/**
 * @title registration
 * @notice function to enter the details of Registration of vehicle
 * @param {*} context the instance of current state
 * @param {*} vin Unique vehicle identification number 
 * @param {*} engNo engine number of the vehicle
 * @param {*} model model of vehicle
 * @param {*} date date of registration
 * @param {*} name name of registrar
 * @param {*} sign public key of the transaction signer (Registration department transactor)
 */
function registration(context, vin, engNo, model, date, name, sign) {
    let vehicle_Address = VehicleDataAddress(vin, sign)
    let vehicle_detail = [vin, engNo, model, date, name]
    return context.getState([vehicle_Address]).then(function (data) {
        console.log("data ", data)
        if (data[vehicle_Address] == null || data[vehicle_Address] == "" || data[vehicle_Address] == []) {
            /**
             * @dev Adding Some Data in Transaction Receipt
             */
            context.addReceiptData(Buffer.from("New Vehicle of VIN No : " + vin + " Registering..........", 'utf8'));
            return writeToStore(context, vehicle_Address, vehicle_detail)
        }
        else {
            throw new InvalidTransaction("Already Registered with VIN no: " + vin);
        }
    })
}

/**
 * @title insurance
 * @dev function to enter the details of Insurance of vehicle
 * @param {*} context the instance of current state
 * @param {*} vin Unique vehicle identification number
 * @param {*} amount Insurance amount
 * @param {*} company insurance company
 * @param {*} date date of payment
 * @param {*} sign public key of the transaction signer (Insurance department transactor)
 */
function insurance(context, vin, amount, company, date, sign) {
    let vehicle_Address = VehicleDataAddress(vin, sign)
    let vehicle_detail = [vin, amount, company, date]
    return context.getState([vehicle_Address]).then(function (data) {
        console.log("data ", data)
        if (data[vehicle_Address] == null || data[vehicle_Address] == "" || data[vehicle_Address] == []) {
            /**
             * @dev Adding Some Data in Transaction Receipt
             */
            context.addReceiptData(Buffer.from("New Vehicle of VIN No : " + vin + " Insurance Details Entering.........", 'utf8'));
            return writeToStore(context, vehicle_Address, vehicle_detail)
        }
        else {
            throw new InvalidTransaction("Insurance details Already entered with VIN no: " + vin);
        }
    })
}

/**
 * @title pollution
 * @dev function to enter the details of Pollution of vehicle
 * @param {*} context instance of current state
 * @param {*} vin Unique vehicle identification number
 * @param {*} amount Pollution amount
 * @param {*} company pollution company
 * @param {*} date date of payment
 * @param {*} sign public key of the transaction signer(Pollution department transactor)
 */
function pollution(context, vin, amount, company, date, sign) {
    let vehicle_Address = VehicleDataAddress(vin, sign)
    let vehicle_detail = [vin, amount, company, date]
    return context.getState([vehicle_Address]).then(function (data) {
        console.log("data", data)
        if (data[vehicle_Address] == null || data[vehicle_Address] == "" || data[vehicle_Address] == []) {
            /**
             * @dev Adding Some Data in Transaction Receipt
             */
            context.addReceiptData(Buffer.from("New Vehicle of VIN No : " + vin + " Insurance Details Entering..........", 'utf8'));
            return writeToStore(context, vehicle_Address, vehicle_detail)
        }
        else {
            throw new InvalidTransaction("Pollution details already exists with VIN no: " + vin);
        }
    })
}

/**
 * @title police
 * @dev function to enter the details of traffic complaints (police) of vehicle
 * @param {*} context instance of current state
 * @param {*} vin Unique vehicle identification number
 * @param {*} complaint complaint number
 * @param {*} date date of complaint
 * @param {*} sign public key of the transaction signer (police department transactor)
 */
function police(context, vin, complaint, date, sign) {
    let vehicle_Address = VehicleDataAddress(vin, sign)
    let vehicle_detail = [vin, complaint, date]
    return writeToStorePolice(context, vehicle_Address, vehicle_detail)
}

/**
 * @title deleteData
 * @dev function to delete the vehicle details
 * @param {*} context instance of current state
 * @param {*} vin Unique vehicle identification number
 * @param {*} sign public key of the transaction signer (concern department transactor)
 */
function deleteData(context, vin, sign) {
    console.log("vin " + vin);
    console.log("sign " + sign);
    let vehicle_Address = VehicleDataAddress(vin, sign)
    console.log("Vehicle Details Address " + vehicle_Address)
    console.log("data deletion progressing");
    return context.getState([vehicle_Address]).then(function (data) {
        console.log("data ", data)
        if (data[vehicle_Address] == null || data[vehicle_Address] == "" || data[vehicle_Address] == []) {
            throw new InvalidTransaction("No such state exists to delete details")
        }
        else {
            /**
             * @dev Adding Some Data in Transaction Receipt
             */
            context.addReceiptData(Buffer.from("Deleting Data of Vehicle with VIN NO : " + vin + "...", 'utf8'));
            return context.deleteState([vehicle_Address])
        }
    })
}


class VehicleHandler extends TransactionHandler {
    constructor() {
        super(FAMILY_NAME, ['1.0'], [NAMESPACE]);
    }
    /**
     * @title apply
     * @param {*} transactionProcessRequest Valid Transaction From Client 
     * @param {*} context instance of current state
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
        console.log("signing Public key " + sign);
        let payload = payloadBytes.toString().split(',')
        console.log("payload ", payload);
        let action = payload[0];
        console.log("action ", action);
        /**
         * @dev function call is based on action
         */
        if (action === "Add Registration") {
            return registration(context, payload[2], payload[3], payload[4], payload[5], payload[6], sign)
        }
        else if (action === "Add Insurance") {
            return insurance(context, payload[2], payload[3], payload[4], payload[5], sign)
        }
        else if (action === "Add Pollution") {
            return pollution(context, payload[2], payload[3], payload[4], payload[5], sign)
        }
        else if (action === "Add Police") {
            return police(context, payload[2], payload[3], payload[4], sign)
        }
        else if (action === "Delete State") {
            return deleteData(context, payload[2], sign)
        }
        else if (action === "") {
            throw new InvalidTransaction("Action is Required")
        }
    }
}
module.exports = VehicleHandler;








