
//funzione per creare la topologia della rete
function create_network(switch_id_array, switch_link_array, host_switch_link, host_id_array){

    //alert("entro?");

    //vettore dei nodi del grafo
    var nodes = [];

    //creazione dei nodi, si assegna a ciascun nodo switch una label con l'id dello switch e ciascun nodo è rappresentato con l'immagine dello switch
    switch_id_array.forEach(function(switchId) {

        nodes.push({ id: switchId, label: switchId, image: 'images/switch.png'});
    });

    //stessa cosa nel caso degli host, cambia solo l'immagine associata
    host_id_array.forEach(function(switchId) {

        nodes.push({ id: switchId, label: switchId, image: 'images/computer.png'});
    });
            
    //vettore dei link del grafo
    var edges = [];

    //creazione degli archi, si dividono gli elementi del vettore separati da un tattito -, questi elementi indicano il nodo sorgente ed il nodo destinazione
    switch_link_array.forEach(function(link) {
                
        var links = link.split('-');
            
        edges.push({ from: links[0], to: links[1] });
    });
           
    //archi tra host e swicth
    host_switch_link.forEach(function(link) {
                
        var links = link.split('-');
        //i link tra host e switch si colorano diversamente, anche quando si selezionano col mouse
        edges.push({ from: links[0], to: links[1], color: { color: "lime", highlight: "#3fff00", hover: "#3fff00"}});
    });

    //creazione dell'oggetto dati per il grafo
    var data = {
        nodes: nodes,
        edges: edges
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

}