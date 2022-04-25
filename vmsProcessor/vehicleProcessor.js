const { TransactionProcessor } = require('sawtooth-sdk/processor');
const VehicleHandler = require('./vehicleHandler');
const GovernmentHandler = require('./governmentHandler');

/**
 * @dev validator port
 */
const address = 'tcp://validator:4004';
/**
 * @dev transactionProcesssor instance created 
 */
const transactionProcesssor = new TransactionProcessor(address);
/**
 * @dev Registering class "VehicleHandler" and "GovernmentHandler" 
 */
transactionProcesssor.addHandler(new VehicleHandler());
transactionProcesssor.addHandler(new GovernmentHandler());
transactionProcesssor.start(); 
