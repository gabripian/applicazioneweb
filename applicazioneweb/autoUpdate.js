//funzione per aggiornare la tabella dei flussi
function updateFlowTable() {

    //si crea un ogetto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    //funzione chiamata quando la proprietà readyState cambia, questa proprietø indica lo stato di XMLHttpRequest
    xhr.onreadystatechange = function() {
        
        //controllo se i dati sono pronti o no
        if(xhr.readyState == 4 && xhr.status == 200){
            //si aggiorna la tabella contenuta nel div con i dati ottenuti sottoforma di stringa
            document.querySelector('#flow_table_container').innerHTML = xhr.responseText;
        }     
    };
    
    //richiesta asincrona alla pagina di aggiornamento
    xhr.open('GET', 'update_flow_table.php', true);
    //richiesta viene inviata in rete
    xhr.send();
}

//aggiornamento viene effettuato ogni minuto (espresso in millisecondi)
setInterval(updateFlowTable, 10000); 




//funzione per aggiornare la tabella delle porte
function updatePortTable() {

    //si crea un ogetto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    //funzione chiamata quando la proprietà readyState cambia, questa proprietø indica lo stato di XMLHttpRequest
    xhr.onreadystatechange = function() {
        
        //controllo se i dati sono pronti o no
        if(xhr.readyState == 4 && xhr.status == 200){
            //si aggiorna la tabella contenuta nel div con i dati ottenuti sottoforma di stringa
            document.querySelector('#port_table_container').innerHTML = xhr.responseText;
        }     
    };
    
    //richiesta asincrona alla pagina di aggiornamento
    xhr.open('GET', 'update_port_table.php', true);
    //richiesta viene inviata in rete
    xhr.send();
}

//aggiornamento viene effettuato ogni minuto (espresso in millisecondi)
setInterval(updatePortTable, 10000); 



//funzione per aggiornare la tabella delle bandwidth
function updateBandwidthTable() {

    //si crea un ogetto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    //funzione chiamata quando la proprietà readyState cambia, questa proprietø indica lo stato di XMLHttpRequest
    xhr.onreadystatechange = function() {
        
        //controllo se i dati sono pronti o no
        if(xhr.readyState == 4 && xhr.status == 200){
            //si aggiorna la tabella contenuta nel div con i dati ottenuti sottoforma di stringa
            document.querySelector('#bandwidth_table_container').innerHTML = xhr.responseText;
        }     
    };
    
    //richiesta asincrona alla pagina di aggiornamento
    xhr.open('GET', 'update_bandwidth_table.php', true);
    //xhr.open('GET', 'update_bandwidth_table.php?nocache=' + new Date().getTime(), true);
    //richiesta viene inviata in rete
    xhr.send();
}

//aggiornamento viene effettuato ogni minuto (espresso in millisecondi)
setInterval(updateBandwidthTable, 10000); 

//funzione per aggiornare il numero di switch, host e link
function updateSummary() {

    //si crea un ogetto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    //funzione chiamata quando la proprietà readyState cambia, questa proprietø indica lo stato di XMLHttpRequest
    xhr.onreadystatechange = function() {
        
        //controllo se i dati sono pronti o no
        if(xhr.readyState == 4 && xhr.status == 200){
            //si aggiorna la tabella contenuta nel div con i dati ottenuti sottoforma di stringa
            document.querySelector('#summary_container').innerHTML = xhr.responseText;
        }     
    };
    
    //richiesta asincrona alla pagina di aggiornamento
    xhr.open('GET', 'update_summary.php', true);
    //richiesta viene inviata in rete
    xhr.send();
}

//aggiornamento viene effettuato ogni minuto (espresso in millisecondi)
setInterval(updateSummary, 10000); 


//funzione per aggiornare la topologia della rete
function updateTopology() {

    //alert("entro1?");
    //alert("entro in update1?");
    //si crea un ogetto XMLHttpRequest
    var xhr = new XMLHttpRequest();

    //funzione chiamata quando la proprietà readyState cambia, questa proprietø indica lo stato di XMLHttpRequest
    xhr.onreadystatechange = function () {
        //alert("entro in update11?");
        //controllo se i dati sono pronti o no
        if(xhr.readyState == 4 && xhr.status == 200){

                //alert("entro in update2?");
                //responseText contiene i dati aggiornati in formato testuale
                var updatedData = JSON.parse(xhr.responseText);
                
                //si richiama la funzione che crea la topologia con i nuovi dati
                create_network(updatedData.switch_id_array, updatedData.switch_link_array, updatedData.host_switch_link, updatedData.host_id_array, updatedData.host_switch_link_id, updatedData.switch_statistics, updatedData.switch_link_id, updatedData.switch_flow_array, updatedData.bandwidth_array);
        }
        
    };
    //richiesta asincrona alla pagina di aggiornamento
    xhr.open('GET', 'update_topology.php', true);
     //richiesta viene inviata in rete
    xhr.send();
}

//aggiornamento viene effettuato ogni minuto (espresso in millisecondi)
setInterval(updateTopology, 10000);





























































/*
window.addEventListener('load', function()
{
    var xhr = null;

    getXmlHttpRequestObject = function()
    {
        if(!xhr)
        {               
            // Create a new XMLHttpRequest object 
            xhr = new XMLHttpRequest();
        }
        return xhr;
    };

    updateLiveData = function()
    {
        
        var now = new Date();
        // Date string is appended as a query with live data 
        // for not to use the cached version 
        var url = 'livefeed.txt?' + now.getTime();
        xhr = getXmlHttpRequestObject();


        xhr.onreadystatechange = evenHandler;

        //invio della richiesta al server

        // asynchronous requests
        xhr.open("GET", url, true);
        // Send the request over the network
        xhr.send(null);
    };

    updateLiveData();

    function evenHandler()
    {
        // Check response is ready or not
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            dataDiv = document.getElementById('liveData');
            // Set current data text
            dataDiv.innerHTML = xhr.responseText;


            // Update the live data every 1 sec
            setTimeout(updateLiveData(), 1000);
        }
    }
});

*/