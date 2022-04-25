
/**
 * @title registrationDepartment
 * @notice A Function to register the details of the Registration of vehicle for the Registration Department
 * @dev Function to Handle the submit button Of Vehicle Registration Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin), Engine NO, 
 * Make & Model Of Vehicle and Date of Registration inputed by User 
 * is assigned to data1,data2,data3,data4 and data5 correspondingly  
 */
function registrationDepartment(event) {
    event.preventDefault();
    const data1 = document.getElementById('private1').value
    const data2 = document.getElementById('vin1').value
    const data3 = document.getElementById('engine1').value
    const data4 = document.getElementById('make1').value
    const data5 = document.getElementById('date1').value
    const data6 = document.getElementById('name1').value
    console.log(data1);
    console.log(data2);
    console.log(data3);
    console.log(data4);
    console.log(data5);
    console.log(data6);
    if (data1.length == 0 || data2.length == 0 || data3.length == 0 || data4.length == 0 || data5.length == 0 | data6.length == 0) {
        alert("Please Fill The Form Completely");
    }
    else {
        $.post('/registration', { write1: data1, write2: data2, write3: data3, write4: data4, write5: data5, write6: data6 }, function (data) {
            if (data.status != 202) {
                alert(data.message);
            }
        }, 'json');
    }
}

/**
 * @title insuranceDepartment
 * @notice A Function to add the details of the Insurance of vehicle for the Insurance Department
 * @dev Function to Handle the submit button Of Vehicle Insurance Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin),Insurance Amount, 
 * Insurance Company and Date of Payment inputed by User
 * is assigned to data1,data2,data3,data4 and data5 correspondingly  
 */
function insuranceDepartment(event) {
    event.preventDefault();
    const data1 = document.getElementById('private2').value
    const data2 = document.getElementById('vin2').value
    const data3 = document.getElementById('amount2').value
    const data4 = document.getElementById('company2').value
    const data5 = document.getElementById('date2').value
    console.log(data1);
    console.log(data2);
    console.log(data3);
    console.log(data4);
    console.log(data5);
    if (data1.length == 0 || data2.length == 0 || data3.length == 0 || data4.length == 0 || data5.length == 0) {
        alert("Please Fill The Form Completely ");
    }
    else {
        $.post('/insurance', { write1: data1, write2: data2, write3: data3, write4: data4, write5: data5 }, function (data) {
            if (data.status != 202)
                alert(data.message);
        }, 'json');
    }
}

/**
 * @title pollutionDepartment
 * @notice A Function to add the details of the Pollution of vehicle for the Pollution Department
 * @dev Function to Handle the submit button Of Vehicle Pollution Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin),Pollution Amount, 
 * Pollution Company and Date of Payment inputed by User 
 * is assigned to data1,data2,data3,data4 and data5 correspondingly  
 */
function pollutionDepartment(event) {
    event.preventDefault();
    const data1 = document.getElementById('private3').value
    const data2 = document.getElementById('vin3').value
    const data3 = document.getElementById('amount3').value
    const data4 = document.getElementById('company3').value
    const data5 = document.getElementById('date3').value
    console.log(data1);
    console.log(data2);
    console.log(data3);
    console.log(data4);
    console.log(data5);
    if (data1.length == 0 || data2.length == 0 || data3.length == 0 || data4.length == 0 || data5.length == 0) {
        alert("Please Fill The Form Completely")
    }
    else {
        $.post('/pollution', { write1: data1, write2: data2, write3: data3, write4: data4, write5: data5 }, function (data) {
            if (data.status != 202) {
                alert(data.message);
            }
        }, 'json');
    }
}

/**
 * @title policeDepartment
 * @notice A Function to add the details of the Traffic violations of vehicle for the Police Department
 * @dev Function to Handle the submit button Of Vehicle Police Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin),Complaint Number and
 * Date of Complaint inputed by User is assigned to data1,data2,data3 and data4 correspondingly  
 */
function policeDepartment(event) {
    event.preventDefault();
    const data1 = document.getElementById('private4').value
    const data2 = document.getElementById('vin4').value
    const data3 = document.getElementById('complaint4').value
    const data4 = document.getElementById('date4').value
    console.log(data1);
    console.log(data2);
    console.log(data3);
    console.log(data4);
    if (data1.length == 0 || data2.length == 0 || data3.length == 0 || data4.length == 0) {
        alert("Please Fill The Form Completely")
    }
    else {
        $.post('/police', { write1: data1, write2: data2, write3: data3, write4: data4 }, function (data) {
            if (data.status != 202) {
                alert(data.message);
            }
        }, 'json');
    }
}

/**
 * @title viewData
 * @notice A Function to View the details of vehicle For Each Department Under 
 * Transaction Family "Vehicle", When Private Key Of Department And Corresponding Vehicle Vin NO: is Given
 * @dev Function to Handle the submit button Of Vehicle Details Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin) inputed by User
 * is assigned to data1,data2 correspondingly  
 */
function viewData(event) {
    event.preventDefault();
    const data1 = document.getElementById('private5').value
    const data2 = document.getElementById('vin5').value
    console.log(data1);
    console.log(data2);
    if (data1.length == 0 || data2.length == 0) {
        alert("Please Fill The Form Completely")
    }
    else {
        $.post('/state', { write1: data1, write2: data2 }, function (data) {
            if (data.status != 202)
                alert("Data of VIN No: " + data2 + " Viewed using key :" + data1)
            document.getElementById("result").value = data.balance;
        }, 'json');
    }
}

/**
 * @title viewData1
 * @notice A Function to View the details of vehicle For Government Vehicles Department 
 * Under Transaction Family "Government" When Private Key Of Government Vehicles Department 
 * And Corresponding Vehicle Vin NO: is Given.
 * @dev Function to Handle the submit button Of Government Vehicle Details Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin) inputed by User 
 * is assigned to data1,data2 correspondingly  
 */
function viewData1(event) {
    event.preventDefault();
    const data1 = document.getElementById('private8').value
    const data2 = document.getElementById('vin8').value
    console.log(data1);
    console.log(data2);
    if (data1.length == 0 || data2.length == 0) {
        alert("Please Fill The Form Completely")
    }
    else {
        $.post('/state1', { write1: data1, write2: data2 }, function (data) {
            if (data.status != 202)
                alert("Data of VIN No: " + data2 + " Viewed using key :" + data1)
            document.getElementById("result1").value = data.balance;
        }, 'json');
    }
}

/**
 * @title deleteData
 * @notice A Function to Delete the details of vehicle For Each Department Under 
 * Transaction Family "Vehicle", When Private Key Of Department And Corresponding Vehicle Vin NO: is Given
 * @dev Function to Handle the submit button Of Vehicle Deletion Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin) inputed by User 
 * is assigned to data1,data2 correspondingly  
 */
function deleteData(event) {
    event.preventDefault();
    const data1 = document.getElementById('private6').value
    const data2 = document.getElementById('vin6').value
    console.log(data1);
    console.log(data2);
    if (data1.length == 0 || data2.length == 0) {
        alert("Please Fill The Form Completely")
    }
    else {
        $.post('/delete', { write1: data1, write2: data2 }, function (data) {
            if (data.status != 202)
                alert(data.message);
        }, 'json');
    }
}

/**
 * @title deleteData1
 * @notice A Function to Delete the details of vehicle For Government Vehicles Department 
 * Under Transaction Family "Government" When Private Key Of Government Vehicles Department 
 * And Corresponding Vehicle Vin NO: is Given.
 * @dev Function to Handle the submit button Of Government Vehicle Deletion Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin) inputed by User 
 * is assigned to data1,data2 correspondingly  
 */
function deleteData1(event) {
    event.preventDefault();
    const data1 = document.getElementById('private9').value
    const data2 = document.getElementById('vin9').value
    console.log(data1);
    console.log(data2);
    if (data1.length == 0 || data2.length == 0) {
        alert("Please Fill The Form Completely")
    }
    else {
        $.post('/delete1', { write1: data1, write2: data2 }, function (data) {
            if (data.status != 202)
                alert(data.message);
        }, 'json');
    }
}

/**
 * @title governmentVehicleDepartment
 * @notice A Function to register the details of the Registration of Government vehicle 
 * for the Government Registration Department
 * @dev Function to Handle the submit button Of Government Vehicle Registration Page Form
 * @dev Private key of Vehicle , Vehicle Identification Number (vin), Engine NO, 
 * Make & Model Of Vehicle and Date of Registration inputed by User
 * is assigned to data1,data2,data3,data4 and data5 correspondingly  
 */
function governmentVehicleDepartment(event) {
    event.preventDefault();
    const data1 = document.getElementById('private7').value
    const data2 = document.getElementById('vin7').value
    const data3 = document.getElementById('department7').value
    const data4 = document.getElementById('make7').value
    const data5 = document.getElementById('date7').value
    console.log(data1);
    console.log(data2);
    console.log(data3);
    console.log(data4);
    console.log(data5);
    if (data1.length == 0 || data2.length == 0 || data3.length == 0 || data4.length == 0 || data5.length == 0) {
        alert("Please Fill The Form Completely")
    }
    else {
        $.post('/government', { write1: data1, write2: data2, write3: data3, write4: data4, write5: data5 }, function (data) {
            if (data1.status != 202) {
                alert(data.message);
            }
        }, 'json');
    }
}

/**
 * @title transactionReceiptData
 * @notice A Function to View the details of Transaction Receipt Data For Each Transaction 
 * When Transaction ID is Given.
 * @dev Function to Handle the submit button Of Transaction Receipt Page Form
 * @dev Transaction ID inputed by User is assigned to data1  
 */
function transactionReceiptData(event) {
    event.preventDefault();
    const data1 = document.getElementById('transactionId10').value
    console.log(data1);
    if (data1.length == 0) {
        alert("Please enter the  Transaction ID")
    }
    else {
        $.post('/transactionReceipts', { write1: data1 }, function (data) {
            if (data.status != 202)
                alert("Transaction Receipt Data viewed of Transaction ID :" + data1)
            document.getElementById("result2").value = data.balance;
        }, 'json');
    }
}

/**
 * @title transactionIdData
 * @notice A Function to Display The Latest Transaction's ID 
 */
function transactionIdData(event) {
    event.preventDefault();
    $.post('/transactionID', {}, function (data) {
        if (data.status != 202)
            alert("Transaction Id viewed");
        document.getElementById("result3").value = data.balance;
    }, 'json');
}

/**
 * @title registrationEvent
 * @notice A Function to Handle The Custom Event Emitted and Alert It On Page
 * Events From Transaction Family "Vehicle" 
 */
function registrationEvent(x) {
    if (x == 0) {
        alert("BMW Model Event occured succesfully");
        // location.reload();
    }
}

/**
 * @title governmentRegistrationEvent
 * @notice A Function to Handle The Custom Event Emitted and Alert It On Page
 * Events From Transaction Family "Government" 
 */
function governmentRegistrationEvent(x) {
    if (x == 0) {
        alert("POLICE Department Event occured succesfully");
    }
}

/**
 * @notice Handling the Event recieved via Socket in Registration Page
 */
if (location.pathname == '/registration') {
    var socket = io("http://localhost:3000");
    var x = 0;
    socket.on('Word-Match-Event', () => {
        console.log("socket message recieved");
        registrationEvent(x);
        x = x + 1;
    })
}

/**
 * @notice Handling the Event recieved via Socket in Government Registration Page
 */
else if (location.pathname == '/government') {
    var socket = io("http://localhost:3000");
    var x = 0;
    socket.on('Government-Word-Match-Event', () => {
        console.log("socket message recieved");
        governmentRegistrationEvent(x);
        x = x + 1;
    })
}
