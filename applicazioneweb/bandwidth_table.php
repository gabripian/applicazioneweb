<!DOCTYPE html>
<html>

    <head>
       
        <link rel="stylesheet" href="style.css">
        <!--si include il file javascript per l'aggiornamento dei dati-->
        <script type="text/javascript" src="autoUpdate.js"></script>

        <?php
               
              //si include il file contenente la funzione di ordinamento del vettore e altre funzioni
              require __DIR__ . '/function.php';
              
        ?>

        <div class="head1">
            
            <h1>Network Status</h1>
        
        </div>
        
    </head>

    <body>

        <div class="navbar">
            <a href="index.php"><img src="images/home.png" alt="Home Icon"> Topology (Home)</a>
            <a href="flow_table.php"><img src="images/table.png" alt="Table Icon"> Flow Table</a>
            <a href="port_table.php"><img src="images/table.png" alt="Table Icon"> Port Table</a>
            <a href="bandwidth_table.php"><img src="images/table.png" alt="Table Icon"> Band Table</a>
        </div>


        <br>
        <br>
        
        <?php


            //array che contiene gli id degli switch
            $switch_id_array=array();
            //array che contiene la abnda di ciascuna porta
            $bandwidth_array= array();

            //si ottengono gli id degli switch ordinati in ordine crescente
            $switch_id_array=get_switch_id();

            //si ricava la banda di ciascuna porta
            $bandwidth_array=get_bandwidth($switch_id_array);

            //tabella delle porte
            echo '<div class="flow_table">Bandwidth Table</div>';
            
            
            //div contenente la tabella delle porte
            echo '<div id="bandwidth_table_container">';
    
                echo '<table>
                <tr>
                    <th>switch id</th>
                    <th>port number</th>
                    <th>bandwidth (bps)</th>
                    <th>max bandwidth (bps)</th>
                    <th>inactive time (sec)</th>
                    <th>duration (sec)</th>
                </tr>';
 
                //si scorre per ciascuno switch
                for($i=0; $i< count($bandwidth_array); $i++){

                    $row=$bandwidth_array[$i];
                    $row1=explode("-",$row);
                    
                    echo '<tr>
                        <td>' .$row1[0]. '</td>
                        <td>' .$row1[1]. '</td>
                        <td>' .$row1[2]. '</td>
                        <td>' .$row1[4]. '</td>
                        <td>' .$row1[5]. '</td>
                        <td>' .$row1[3]. '</td>
                    </tr>';
        
                }
    
               
                
                echo '</table>';

            echo '</div>';

            echo '</br>';
            echo '</br>';
            
            
           

        ?>
        

    </body>

</html>