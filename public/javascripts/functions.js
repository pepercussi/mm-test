const apiRestHost = "http://localhost:3000";
const webSocketHost = "ws://localhost:3030";
let websocket;

// This function runs when you click in "Add Key Value" button
function sendText(event){
    event.preventDefault();
    let key = event.target.key.value;
    let val = event.target.val.value;
    let keyValueObject = {};
    keyValueObject[key] = val;

    // Send the value from field to the server
    doSend(JSON.stringify(keyValueObject));
    // Clean the fields
    event.target.key.value="";
    event.target.val.value="";
}

// init function runs once the page is loaded
function init() {
    // Connect to WebSocket server
    wsConnect();
}

// This function is used to connect with WebSocket Server
function wsConnect() {
    // Connect to WebSocket server
    websocket = new WebSocket(webSocketHost);

    // Callbacks asignation
    websocket.onopen = function (evt) {
        onOpen(evt)
    };
    websocket.onclose = function (evt) {
        onClose(evt)
    };
    websocket.onmessage = function (evt) {
        onMessage(evt)
    };
    websocket.onerror = function (evt) {
        onError(evt)
    };
}

// This runs once WebSocket server conection is stabilished
function onOpen(evt) {
    // Enable "Add Key Value" button
    document.getElementById("btnSend").disabled = false;
}

// This runs once WebSocket server conection is closed
function onClose(evt) {

    // Disable "Add Key Value" button
    document.getElementById("btnSend").disabled = true;

    // Try to reconnect every 2 seconds
    setTimeout(function () {
        wsConnect()
    }, 2000);
}

// Runs once a message from WebSocket server is received
function onMessage(evt) {
    // Adding the received message into a textarea
    $("#messages").append("<li class='list-group-item'>" + evt.data + "</li>");
}

// Runs when there is an error in the WebSocket
function onError(evt) {
    console.log("ERROR: " + evt.data);
}

// Send a message to the WebSocket server and print it in the console
function doSend(message) {
    console.log("Sending: " + message);
    websocket.send(message);
}


// Call init function once page is loaded
window.addEventListener("load", init, false);

$( "#btnGetKeyValue" ).click(function() {
    let key = $("#key").val();
    $.get( apiRestHost+'/rest/', { key: key }, function( data ) {
        cleanMessageBlock();
        if(data.status != "error"){
            $("#messageTitle").append("Value for \""+key+"\" key:");
            if(data.value != ""){
                $("#messageDetail").append(data.value);
            }else{
                $("#messageDetail").append("<p class='bg-warning'>The key " + key + " was not created yet</p>");
            }
        }else{
            $("#messageTitle").append("An error happened requesting the values for the key \""+key+"\":");
            $("#messageDetail").append("<p class='bg-warning'>" + data.error.details[0].message + "</p>");
        }
        
    }).fail(function() {
    alert( "An unespected error was happen" );
    });
});

function cleanMessageBlock(){
    $("#messageTitle").empty();
    $("#messageDetail").empty();
}

$( "#btnGetAllKeyValue" ).click(function() {
    $.get( apiRestHost+'/rest/all/', function( data ) {
        cleanMessageBlock();
        $("#messageTitle").append("Keys list:");
        if(data.status == "ok"){
            let list = "<ul class='list-group' >";
            data.arrayData.forEach(key => {
                list += "<li class='list-group-item'>" + key + "</li>"
            });
            list += "</ul>";
            $("#messageDetail").append(list);
        }else{
            $("#messageDetail").append("<p class='bg-warning'>There aren't keys created yet</p>");
        }
        
    }).fail(function() {
        alert( "An unespected error was happen" );
    });
});


$( "#btnCleanKeys" ).click(function() {
    cleanMessageBlock();
    $("#alertModal").modal("hide");
    
    $.post( apiRestHost+'/rest/delete/all', function( data ) {
        if(data.status && data.status == "ok"){
            $("#messageTitle").append("All keys where deleted");
            $("#messages").empty();
        }else{
            alert( "An unespected error was happen" );
        }
    }).fail(function() {
        alert( "An unespected error was happen" );
    });
});
