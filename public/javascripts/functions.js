const apiRestHost = "http://localhost:3000";
const webSocketHost = "ws://localhost:3030";

// Se invoca cuando se oprime el botón Enviar
function enviarTexto(event){
    event.preventDefault();
    var key = event.target.key.value;
    var val = event.target.val.value;
    var keyValueObject = {};
    keyValueObject[key] = val;

    // Enviamos el valor del campo al servidor
    doSend(JSON.stringify(keyValueObject));
    // Vaciamos los campos
    event.target.key.value="";
    event.target.val.value="";
}

// La función init se ejecuta cuando termina de cargarse la página
function init() {
    // Conexión con el servidor de websocket
    wsConnect();
}

// Invoca esta función para conectar con el servidor de WebSocket
function wsConnect() {
    // Connect to WebSocket server
    websocket = new WebSocket(webSocketHost);

    // Asignación de callbacks
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

// Se ejecuta cuando se establece la conexión Websocket con el servidor
function onOpen(evt) {
    // Habilitamos el botón Enviar
    document.getElementById("enviar").disabled = false;
    // Enviamos el saludo inicial al servidor
    // doSend("Bienvenid@! Este es el primer mensaje por defecto. Disfruta de esta app :)");
}

// Se ejecuta cuando la conexión con el servidor se cierra
function onClose(evt) {

    // Deshabilitamos el boton
    document.getElementById("enviar").disabled = true;

    // Intenta reconectarse cada 2 segundos
    setTimeout(function () {
        wsConnect()
    }, 2000);
}

// Se invoca cuando se recibe un mensaje del servidor
function onMessage(evt) {
    // Agregamos al textarea el mensaje recibido
    var area = document.getElementById("mensajes")
    area.innerHTML += evt.data + "\n";
}

// Se invoca cuando se presenta un error en el WebSocket
function onError(evt) {
    console.log("ERROR: " + evt.data);
}

// Envía un mensaje al servidor (y se imprime en la consola)
function doSend(message) {
    console.log("Sending: " + message);
    websocket.send(message);
}


// Se invoca la función init cuando la página termina de cargarse
window.addEventListener("load", init, false);

$( "#btnGetKeyValue" ).click(function() {
    var key = $("#key").val();
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
            var list = "<ul class='list-group list-group-flush' >";
            data.arrayData.forEach(key => {
                list += "<li>" + key + "</li>"
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
            $("#mensajes").empty();
        }else{
            alert( "An unespected error was happen" );
        }
    }).fail(function() {
        alert( "An unespected error was happen" );
    });
});
