
//funzione per creare la topologia della rete
function create_network(switch_id_array, switch_link_array, host_switch_link, host_id_array, host_switch_link_id, switch_statistics, switch_link_id, switch_flow_array, bandwidth_array){

    //alert("entro?");
    //alert(switch_link_id);
    //alert("link id "+host_switch_link_id);
    //alert("statistics "+switch_statistics);
    //vettore dei nodi del grafo
    var nodes = [];

    
    //creazione dei nodi, si assegna a ciascun nodo switch una label con l'id dello switch e ciascun nodo è rappresentato con l'immagine dello switch
    switch_id_array.forEach(function(switchId) {

        nodes.push({ id: switchId, label: switchId, image: 'images/switch.png'});
    });

    //stessa cosa nel caso degli host, cambia solo l'immagine associata
    host_id_array.forEach(function(hostId) {

        nodes.push({ id: hostId, label: hostId, image: 'images/computer.png'});
    });
            
    //vettore dei link del grafo
    var edges = [];

    var edges1 = [];

    //creazione degli archi, si dividono gli elementi del vettore separati da un tattito -, questi elementi indicano il nodo sorgente ed il nodo destinazione
    switch_link_array.forEach(function(link) {
                
        var links = link.split('-');
            
        edges.push({id: link, from: links[0], to: links[1] });
    });

    
           
    //archi tra host e swicth
    host_switch_link.forEach(function(link) {
                
        var links = link.split('-');
        //i link tra host e switch si colorano diversamente, anche quando si selezionano col mouse
        edges.push({id: link, from: links[0], to: links[1], color: { color: "lime", highlight: "#3fff00", hover: "#3fff00"}});
    });

    /*
    edges.forEach(function(edge) {

        alert("id: "+ edge.id+"from: "+ edge.from+ ", to: "+ edge.to);
    });
    */
    
    //si aggiornano i colori dei link, serve anche host_switch_link_id dato che contiene le porte collegate
    edges1=updateEdgeColors(bandwidth_array, edges, host_switch_link_id, switch_link_id);
    
    
    //creazione dell'oggetto dati per il grafo
    var data = {
        nodes: nodes,
        edges: edges1
    };

    //opzioni per la visualizzazione del grafo
    var options = {
        layout: {
                    
            //false altrimenti la rete viene rappresentata come albero in cui i nodi non si possono trascinare dalla loro posizione nell'albero
            hierarchical: false
        },
        interaction: {
            //quando si passa col mouse sopra un elemento, viene evidenziato
            hover: true
        },
        nodes: {
            //i nodi si rappresentano come immagine
            shape: 'image'
                    
        },
        edges: {
            //spessore dei link
            width: 3
                    
            }
    };

    //creazione del grafo
    var container = document.getElementById('container');
    var network = new vis.Network(container, data, options);
   

    var popup = document.getElementById('popup');
    var popupContent = document.getElementById('popup-content');
    var hoveringEdge = false; // Flag per tracciare se il mouse è sopra un edge

    //alert("entro1?");
    
   // Aggiungi l'evento hoverNode per gestire il passaggio del mouse sugli archi
    network.on("hoverEdge", function (event) {
        var edge = network.getEdgeAt(event.pointer.DOM);
        //alert(edge);

        var links = edge.split('-');
        var port;
        var bandwidth;
        var src_bandwidth;
        var dst_bandwidth;
        //alert(links[0]);
        //alert(links[1]);
       
        if (edge !== undefined) {
            //var edgeData = edges.get(edge);
            //alert("From: " + edgeData.from + ", To: " + edgeData.to);

            //il link è tra host e switch
            if(edge.length<42){
                //si ricava lo switch del link selezionato
                var hub=links[1];
                //si scorre il vettore con i link tra host e switch e numeri di porta relativi
                for(var i=0; i<host_switch_link_id.length; i++){    

                
                    
                    //alert("port "+port);
                    //alert("switch "+hub);
                    //alert("edge= "+edge);
                    
                    //alert("edge1= "+host_switch_link_id[i].substring(0, 41));
                    //alert("host_switch_link_id[i] "+host_switch_link_id[i]);
                    //se il link corrisponde a quello selezionato, si esce e la porta indica quella dello switch coinvolta in quel collegamento
                    if(edge === host_switch_link_id[i].substring(0, 41)){
                        
                        //alert("edge ed edge1 sono uguali");
                        //alert("edge1= "+host_switch_link_id[i].charAt(42));
                        //si ricava il numero di porta dell'elemento indicato dal mouse
                        port=host_switch_link_id[i].charAt(42);
                        break;
                    }
                }

                //alert("port "+port);
                //alert("switch "+hub);
                //si ricava la posizione della porta  dello switch evidenziato nel link
                var x=get_switch_position(switch_statistics, hub, port);
                
                //vettore contenente i valori da assegnare alla tabella visualizzata
                var table_hover =[];
                //si assegnano i valori da visualizzare 
                for(var i=0; i<9; i++){
                    
                    table_hover[i]=switch_statistics[x+1+i];
                    
                }

                //alert("entro2?");

                //si ricava la bandwidth relativa
                for(var i=0; i<bandwidth_array.length; i++){
                    
                    bandwidth=bandwidth_array[i].split("-");
                    //se lo switch e la porta corrispondono si assegna la bandwidth (bandwidth[2])
                    if(bandwidth[0] == links[1] && bandwidth[1] ==port){
                    
                        break;      
                    }       
                }
                
                //alert("entro3?");

                //se i dati sono troppo grandi si inserisce la notazione scientifica
                for(var i=0; i <table_hover.length; i++){
                    
                    if(table_hover[i] > 1000000){
                       
                        table_hover[i]=parseInt(table_hover[i]);
                        table_hover[i]=table_hover[i].toExponential(2);   
                    }

                }


                popupContent.innerHTML = "Host: " + links[0] + "<br>Switch: " + links[1]+ "<br> Port: "+port+ " Bandwidth: "+bandwidth[2]+"<br>"+
                "<table id='table_host_switch'><tr><th>receive packets</th>"+
                "<th>transmit packets</th>"+
                "<th>receive bytes</th>"+
                "<th>transmit bytes</th>"+
                "<th>receive dropped</th>"+
                "<th>transmit dropped</th>"+
                "<th>receive errors</th>"+
                "<th>transmit errors</th>"+
                "<th>duration (sec)</th></tr>"+
                
                "<tr><td>"+table_hover[0]+"</td>"+
                "<td>"+table_hover[1]+"</td>"+
                "<td>"+table_hover[2]+"</td>"+
                "<td>"+table_hover[3]+"</td>"+
                "<td>"+table_hover[4]+"</td>"+
                "<td>"+table_hover[5]+"</td>"+
                "<td>"+table_hover[6]+"</td>"+
                "<td>"+table_hover[7]+"</td>"+
                "<td>"+table_hover[8]+"</td></tr></table>";

                popup.style.display = "block";
                hoveringEdge = true;
                //alert("ciao!");
            }else{
                //il link è tra switch e switch

                for(var i=0; i<switch_link_id.length; i++){    

                    //alert(switch_link_id[i].substring(0, 23));
                    //alert(switch_link_id[i].substring(26, 49));

                    //se il link corrisponde a quello selezionato, si esce e la porta indica quella dello switch coinvolta in quel collegamento
                    if(links[0] === switch_link_id[i].substring(0, 23) && links[1] === switch_link_id[i].substring(26, 49)){
                        
                       
                        //si ricava il numero di porta degli switch del colegamento indicato dal mouse
                        src_port=switch_link_id[i].charAt(24);
                        dst_port=switch_link_id[i].charAt(50);
                        break;
                    }
                }
               
                //alert(links[0]);
                //alert(links[1]);
                //alert(src_port);
                //alert(dst_port);

                var x1=get_switch_position(switch_statistics, links[0], src_port);
                var x2=get_switch_position(switch_statistics, links[1], dst_port);
                
                //vettori contenenti i valori da assegnare alla tabella visualizzata
                var table_hover1 =[];
                var table_hover2 =[];
                //si assegnano i valori da visualizzare 
                for(var i=0; i<9; i++){
                    
                    table_hover1[i]=switch_statistics[x1+1+i];
                    
                }
                //si assegnano i valori da visualizzare 
                for(var i=0; i<9; i++){
                    
                    table_hover2[i]=switch_statistics[x2+1+i];
                    
                }

                //alert(" table_hover= "+ table_hover);

                //alert("entro4?");
                //sia ssegna al bandwidth relativa
                for(var i=0; i<bandwidth_array.length; i++){
                    
                    bandwidth=bandwidth_array[i].split("-");
                    //se lo switch e la porta corrispondono si assegna la bandwidth (bandwidth[2])
                    if(bandwidth[0] == links[0] && bandwidth[1] ==src_port){
                        
                        src_bandwidth=bandwidth[2];
                            
                    }else if(bandwidth[0] == links[1] && bandwidth[1] ==dst_port){
                        
                        dst_bandwidth=bandwidth[2];     
                    }       
                }

                //alert("entro5?");
                //se i numeri sono troppo grandi si utilizza notazione scientifica, le due tabelle hanno stessa dimensione
                for(var i=1; i <table_hover1.length; i++){
                    
                    if(table_hover1[i] > 1000000){

                        table_hover1[i]=parseInt(table_hover1[i]);
                        table_hover1[i]=table_hover1[i].toExponential(2);
                        table_hover2[i]=parseInt(table_hover2[i]);
                        table_hover2[i]=table_hover2[i].toExponential(2);
                        
                    }

                    

                }

                popupContent.innerHTML = "src-Switch: " + links[0] + "<br> src-Port: "+ src_port + " src-Bandwidth:"+src_bandwidth+ "<br>dst-Switch: " + links[1] + "<br> dst-Port: " + dst_port +" dst-Bandwidth:"+dst_bandwidth+ "<br>"+
                "<table id='table_host_switch1'><tr><th>direction</th>"+
                "<th>receive packets</th>"+
                "<th>transmit packets</th>"+
                "<th>receive bytes</th>"+
                "<th>transmit bytes</th>"+
                "<th>receive dropped</th>"+
                "<th>transmit dropped</th>"+
                "<th>receive errors</th>"+
                "<th>transmit errors</th>"+
                "<th>duration (sec)</th></tr>"+
                
                "<tr><td>src</td>"+
                "<td>"+table_hover1[0]+"</td>"+
                "<td>"+table_hover1[1]+"</td>"+
                "<td>"+table_hover1[2]+"</td>"+
                "<td>"+table_hover1[3]+"</td>"+
                "<td>"+table_hover1[4]+"</td>"+
                "<td>"+table_hover1[5]+"</td>"+
                "<td>"+table_hover1[6]+"</td>"+
                "<td>"+table_hover1[7]+"</td>"+
                "<td>"+table_hover1[8]+"</td></tr>"+
                
                "<tr><td>dst</td>"+
                "<td>"+table_hover2[0]+"</td>"+
                "<td>"+table_hover2[1]+"</td>"+
                "<td>"+table_hover2[2]+"</td>"+
                "<td>"+table_hover2[3]+"</td>"+
                "<td>"+table_hover2[4]+"</td>"+
                "<td>"+table_hover2[5]+"</td>"+
                "<td>"+table_hover2[6]+"</td>"+
                "<td>"+table_hover2[7]+"</td>"+
                "<td>"+table_hover2[8]+"</td></tr></table>";

                popup.style.display = "block";
                hoveringEdge = true;


            }
        }
        
    });

    // Aggiungi l'evento blurNode per nascondere la finestra quando il mouse viene tolto dall'edge
    network.on("blurEdge", function () {
        //alert("entro?");
        if (hoveringEdge) {
            popup.style.display = "none"; // Chiudi la finestra solo se il mouse non è sopra un edge
        }
        hoveringEdge = false; // Imposta il flag a false quando il mouse viene tolto dall'edge
    });
    

    // Aggiungi l'evento hoverNode per gestire il passaggio del mouse sugli archi
    network.on("hoverNode", function (event) {
        //si ricava lo switch selezionato
        var node = network.getNodeAt(event.pointer.DOM);
        //alert(node);

        //alert(links[0]);
        //alert(links[1]);
       
        if (node !== undefined) {
            //se il nodo selezionato è uno switch si mostra la tabella, altrimenti no
            //alert("node.length "+node.length);
            if(node.length== 23){ 
                //posizione dello switch selezionato nel vettore 
                 var x;

                //si scorre il vettore con i link tra host e switch e numeri di porta relativi
                for(var i=0; i<switch_flow_array.length; i++){    
                    //se lo switch corrisponde si selezionano gli elementi della tabella corrispondente
                    if(node === switch_flow_array[i]){
                         //si ricava la posizione dello switch
                        x=i;
                        break;
                    }
                }

                //vettore contenente i valori da assegnare alla tabella visualizzata
                var table_hover =[];
                //si assegnano i valori da visualizzare 
                for(var i=0; i<4; i++){
                    
                    table_hover[i]=switch_flow_array[x+1+i];
                    
                }
                //alert(" table_hover= "+ table_hover);



                popupContent.innerHTML = "Switch: " + node + "<br>"+
                "<table id='table_switch_flow'><tr><th>flow count</th>"+
                "<th>packet count</th>"+
                "<th>byte count</th>"+   
                "<th>duration (sec)</th></tr>"+
                
                "<tr><td>"+table_hover[0]+"</td>"+
                "<td>"+table_hover[1]+"</td>"+
                "<td>"+table_hover[2]+"</td>"+
                "<td>"+table_hover[3]+"</td></tr></table>";

                popup.style.display = "block";
                hoveringEdge = true;
            }   //alert("ciao!");
            
        }
        
    });

    // Aggiungi l'evento blurNode per nascondere la finestra quando il mouse viene tolto dall'edge
    network.on("blurNode", function () {
        //alert("entro?");
        if (hoveringEdge) {
            popup.style.display = "none"; // Chiudi la finestra solo se il mouse non è sopra un edge
        }
        hoveringEdge = false; // Imposta il flag a false quando il mouse viene tolto dall'edge
    });
    

    

}

//restituisce la posizione della porta dello switch coinvolta nel link selezionato
function get_switch_position(switch_statistics, hub, port){

    //posizione del'id dello switch selezionato nel vettore switch_statistics
    var x=switch_statistics.indexOf(hub);
    //scostamento numeri di porta nel vettore switch_statistics
    var z=1;
    //alert("x= "+x);
    //se l'elemento successivo all'id dello switch corrisponde alla porta selezionata si prende l'indice
    //alert("switch_statistics[x+z]= "+switch_statistics[x+z]);
    if(switch_statistics[x+z]== port){

        x+=z;
        //alert("x= "+x);
    }else{
        //altrimenti si scorre avanzando si 10, controllando per ogni porta
        while(true){

            z+=10;
            //alert("z= "+z);
            //quando si trova la porta corrispondente si esce ricavando la posizione
            //alert("switch_statistics[x+z]= "+switch_statistics[x+z]);
            if(switch_statistics[x+z]== port){
                x+=z;
                //alert("x= "+x);
                break;
            }
        }
    }

    return x;
}


// Funzione per aggiornare i colori degli edge in base alla banda selezionata
function updateEdgeColors(bandwidth_array, edges, host_switch_link_id, switch_link_id) {
    // Recupera l'oggetto network dal container
    var container = document.getElementById('container');
    
    

    // Ottieni il riferimento all'elemento select
    var selectElement = document.getElementById('bandwidth');

    // Ottieni il valore selezionato
    var selectedBandwidth = selectElement.value;
    
    var edgeBandwidth;
    var edges1=[];
    var port;
    // Loop attraverso gli edge e aggiorna i colori in base alla banda selezionata
    edges.forEach(function (edge) {
        // Recupera l'id dell'edge
        var edgeId = edge.id;
        //alert("edgeId "+edgeId.length);
        //alert("edgeId="+edgeId+"from="+edge.from+"to="+edge.to);

        
       
        
            //alert(links_array);
            //se link tra host e switch 
            if(edgeId.length == 41){

               
                for(var j=0; j<host_switch_link_id.length; j++){

                    //controlla switch e porta e ricava la banda
                    var check1=host_switch_link_id[j].split('-');
                    //alert("check1="+check1[0]);
                    //alert("check2="+check1);
                    //bisogna controllare che lo switch sia quello nel link che si controlla
                    if((check1[0]==edge.from) && (check1[1]==edge.to)){

                        port=check1[2];
                        //alert("bandwidth switch: "+ edgeBandwidth);
                        break;
                    }
                }

                for(var i=0;i<bandwidth_array.length;i++){
       
                    //si ricavano 
                    var links_array = bandwidth_array[i].split('-');
                    
                    if((links_array[0]==edge.to) && (links_array[1]==port)){

                        edgeBandwidth=links_array[2];
                        //alert("bandwidth switch: "+ edgeBandwidth);
                        break;
                    }

                } 

            //se link tra switch 
            }else if(edgeId.length == 47){
               
                for(var j=0; j<switch_link_id.length; j++){
                    
                    //controlla switch e porta sorgente e ricava la banda
                    
                    var check1=switch_link_id[j].split('-');
                    //alert("check1="+check1);
                    if((check1[0]==edge.from) && (check1[2]==edge.to)){

                        port=check1[1];
                        //alert("bandwidth switch: "+ edgeBandwidth);
                        break;
                    }
                }

                for(var i=0;i<bandwidth_array.length;i++){
       
                    //si ricavano 
                    var links_array = bandwidth_array[i].split('-');
                    
                    if((links_array[0]==edge.from) && (links_array[1]==port)){

                        edgeBandwidth=links_array[2];
                        //alert("bandwidth switch: "+ edgeBandwidth);
                        break;
                    }

                } 
            }            
        
            //se numero grande e viene rappresentato con la virgola, si rimuove 
            if(edgeBandwidth.indexOf(",") != -1){
                //alert("edgeBandwidth.indexOf(,)= "+edgeBandwidth.indexOf(","));
                var index=edgeBandwidth.indexOf(",");
                var a=edgeBandwidth.substring(0, index);
                var b=edgeBandwidth.substring(index+1, edgeBandwidth.length);
                edgeBandwidth=a+b;
            }
        
        // Verifica se la banda è inferiore alla prima cifra selezionata
        if (parseFloat(edgeBandwidth) < parseFloat(selectedBandwidth.split('-')[0])) {
            //alert(edgeBandwidth+"<"+ selectedBandwidth.split('-')[0]);
            
           
            //alert("id:"+ edgeId+ "from:"+ links[0]+ "to:"+ links[1]);
            edges1.push({id: edgeId, from: edge.from, to: edge.to, color: "lime"}); // Colore verde
           
            
            
        } else if (parseFloat(edgeBandwidth) >= parseFloat(selectedBandwidth.split('-')[0]) && parseFloat(edgeBandwidth) <= parseFloat(selectedBandwidth.split('-')[1])) {
            //alert(edgeBandwidth+">"+ selectedBandwidth.split('-')[0]+"<"+ selectedBandwidth.split('-')[1]);
            
            //alert("id:"+ edgeId+ "from:"+ links[0]+ "to:"+ links[1]);
            edges1.push({id: edgeId, from: edge.from, to: edge.to, color: '#F6BE00' }); // Colore giallo
            

        } else {
           //alert(edgeBandwidth+">"+ selectedBandwidth.split('-')[1]);
            
            //alert("id:"+ edgeId+ "from:"+ links[0]+ "to:"+ links[1]);
            edges1.push({id: edgeId, from: edge.from, to: edge.to, color: 'red' }); // Colore rosso
            
        }
        
    });

    return edges1;
    
}