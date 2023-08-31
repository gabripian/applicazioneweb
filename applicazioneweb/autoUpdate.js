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
setInterval(updateFlowTable, 60000); 




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
setInterval(updatePortTable, 60000); 


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
setInterval(updateSummary, 60000); 


//funzione per aggiornare la topologia della rete
function updateTopology() {

    //alert("entro1?");
    //si crea un ogetto XMLHttpRequest
    var xhr = new XMLHttpRequest();

    //funzione chiamata quando la proprietà readyState cambia, questa proprietø indica lo stato di XMLHttpRequest
    xhr.onreadystatechange = function () {

        //controllo se i dati sono pronti o no
        if(xhr.readyState == 4 && xhr.status == 200){

                //alert("entro2?");
                //responseText contiene i dati aggiornati in formato testuale
                var updatedData = JSON.parse(xhr.responseText);
                
                //si richiama la funzione che crea la topologia con i nuovi dati
                create_network(updatedData.switch_id_array, updatedData.switch_link_array, updatedData.host_switch_link, updatedData.host_id_array);
        }
        
    };
    //richiesta asincrona alla pagina di aggiornamento
    xhr.open('GET', 'update_topology.php', true);
     //richiesta viene inviata in rete
    xhr.send();
}

//aggiornamento viene effettuato ogni minuto (espresso in millisecondi)
setInterval(updateTopology, 60000);