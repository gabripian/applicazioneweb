<!DOCTYPE html>
<html>

    <head>
       
        <link rel="stylesheet" href="style.css">
        <!--si include il file javascript contenente la funzione di creazione della topologia della rete -->
        <script type="text/javascript" src="script.js"></script>
        <!--libreria per creare la topologia della rete -->
        <script type="text/javascript" src="https://unpkg.com/vis-network@9.0.3/dist/vis-network.min.js"></script>
        <!--si include il file javascript per l'aggiornamento dei dati-->
        <script type="text/javascript" src="autoUpdate.js"></script>

        <?php
              //si include il file contenente la funzione di ordinamento del vettore e altre funzioni
              require __DIR__ . '/function.php';

        ?>

        <div id="head1">
            
            <h1 id="head2">Network Status</h1>
        
        </div>
        
    </head>

    <body>
   
       
        <?php
            //array contenente il numero di switch, host e link
            $summary=array();

            //si assegna il numero di switch, host e link
            $summary=get_summary();

            $num_switch=$summary[0];
            $num_host=$summary[1];
            $num_link=$summary[2];
            
        ?>
    
        <div id="summary_container">
            <div id="switch"><img src="images/switch.png" alt="Switch Icon">Switch<div class="numberswitch"><?php echo $num_switch; ?></div></div>
            <div id="host"><img src="images/computer.png" alt="Host Icon">Host<div class="number"><?php echo $num_host; ?></div></div>
            <div id="link"><img src="images/networking.png" alt="Link Icon">Link<div class="number"><?php echo $num_link; ?></div></div>
        </div>
    


        <?php


            //array che contiene gli id degli switch
            $switch_id_array=array();
            //array che contiene i link tra i vari switch
            $switch_link_array=array();
            //array che contiene gli id degli host
            $host_id_array=array();
            //array contenente le coppie indirizzo dell'host e identificatore dello switch a cui è collegato l'host, separati da un trattino -
            $host_switch_link=array();

            //si ottengono gli id degli switch ordinati in ordine crescente
            $switch_id_array=get_switch_id();

            //si ottengono i link tra switch
            $switch_link_array=get_switch_link();

            //si ottengono i link tra host e switch
            $host_switch_link=get_host_switch_link();

            //si assegnano al relativo vettore, gli identificatori di ciascun host già ricavati e salvati in $host_switch_link concatenati con gli id degli switch collegati
            foreach($host_switch_link as $key => $value) {
                //gli identificatori sono lunghi 17 caratteri
                $host_id_array[$key]=substr($host_switch_link[$key], 0, 17);
               

            }

            //si ordinano gli id degli host
            sort($host_id_array);
            
        ?>
        <div id="topology">Network Topology</div>      
        <div id="container"></div>

        <script>
           
            //assegnazione del contenuto degli array in PHP agli array in js
            var switch_id_array = <?php echo json_encode($switch_id_array); ?>;
            var switch_link_array = <?php echo json_encode($switch_link_array); ?>;
            var host_switch_link = <?php echo json_encode($host_switch_link); ?>;
            var host_id_array = <?php echo json_encode($host_id_array); ?>;

            //si crea la topologia della rete
            create_network(switch_id_array, switch_link_array, host_switch_link, host_id_array);
    
        </script>
        
        <br>
        <br>
        <br>

        <?php

            //numero totale di switch
            $count = count($switch_id_array);

            //tabella dei flussi
            echo '<div class="flow_table">Flow Table</div>';
            //div contenente la tabella dei flussi
            echo '<div id="flow_table_container">';
   
                echo '<table>
                <tr>
                    <th>switch id</th>
                    <th>flow count</th>
                    <th>packet count</th>
                    <th>byte count</th>
                    <th>duration (sec)</th>
                </tr>';
                
                //array da riempire con i dati da inserire in una singola riga della tabella
                $raw=array();

                for($i=0; $i< $count; $i++){

                    //si ricava ogni riga da inserire nella tabella riguardo la tabella di flusso per ogni switch
                    $raw=get_flow_table_row($switch_id_array, $i);

                    echo '<tr>
                    <td>'.$switch_id_array[$i].'</td>
                    <td>' .$raw[0].'</td>
                    <td>' .$raw[1]. '</td>
                    <td>' .$raw[2]. '</td>
                    <td>' .$raw[3]. '</td>
                    </tr>';
                }

                echo '</table>';

            echo '</div>';

            echo '<br>';
            echo '<br>';
            
            //tabella delle porte
            echo '<div class="flow_table">Port Table</div>';
            
            
            //div contenente la tabella delle porte
            echo '<div id="port_table_container">';
    
                echo '<table>
                <tr>
                    <th>switch id</th>
                    <th>port number</th>
                    <th>state</th>
                    <th>receive packets</th>
                    <th>transmit packets</th>
                    <th>receive bytes</th>
                    <th>transmit bytes</th>
                    <th>receive dropped</th>
                    <th>transmit dropped</th>
                    <th>receive errors</th>
                    <th>transmit errors</th>
                    <th>duration (sec)</th>
                </tr>';

                //array che contiene le informazioni di un singolo switch
                $single_switch=array();

                //si scorre per ciascuno switch
                for($i=0; $i< $count; $i++){

                    //array contenente lo stato attivo/non attivo di ogni porta degli switch
                    $state=array();

                    //si ricava lo stato di tutte le interfacce dello switch $switch_id_array[$i]
                    $state=get_port_state($switch_id_array, $i);

                    //si ricavano le righe della tabella porte dello switch
                    $single_switch=get_port_table_raw($switch_id_array, $i);
                
                    
                    //per ciascuna porta si ottengono 10 informazioni, dividendo di un fattore 10 si ottiene il numero di porte di ogni switch
                    $single_switch_length=count($single_switch)/10;

                    //utilizzando l'algoritmo bubble sort si ordina il vettore in base al numero di porta crescente, si scambiano 10 elementi consecutivi con altri 10 elementi
                    //consecutivi dato che ogni 10 elementi dell'array sono riferiti ad un'unica porta
                    $single_switch=array_sort($single_switch, $single_switch_length);
                    

                    for($l=0; $l<$single_switch_length; $l++){

                        echo '<tr>
                            <td>'.$switch_id_array[$i].'</td>
                            <td>' .$single_switch[0]. '</td>
                            <td>' .$state[$l].'</td>
                            <td>' .$single_switch[1]. '</td>
                            <td>' .$single_switch[2]. '</td>
                            <td>' .$single_switch[3].'</td>
                            <td>' .$single_switch[4]. '</td>
                            <td>' .$single_switch[5]. '</td>
                            <td>' .$single_switch[6]. '</td>
                            <td>' .$single_switch[7]. '</td>
                            <td>' .$single_switch[8]. '</td>
                            <td>' .$single_switch[9]. '</td>
                        </tr>';

                        //si fanno avanzare i dati di 10 posizioni
                        array_splice($single_switch, 0, 10);
                        
                    }
    
                }
                
                echo '</table>';

            echo '</div>';

            echo '</br>';
            echo '</br>';

            //metodo per abilitare le statistiche, ma non funziona

            /*

            $url ='http://127.0.0.1:8080/wm/statistics/config/enable/json';

            $data ='';

            $curl = curl_init($url);

            // 1. Set the CURLOPT_RETURNTRANSFER option to true
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');

            // 2. Set the CURLOPT_POST option to true for POST request
            //curl_setopt($curl, CURLOPT_POST, true);

            // 3. Set the request data as JSON using json_encode function
            curl_setopt($curl, CURLOPT_POSTFIELDS,  json_encode($data));

            $response = curl_exec($curl);

            curl_close($curl);

            echo $response;

            */




        ?>
        

    </body>

</html>