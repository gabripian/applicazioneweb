<?php
    // Include il file contenente le funzioni per ottenere i dati aggiornati
    require __DIR__ . '/function.php';

    //si aggiornano i dati utilizzando le funzioni definite nel file function.php
    $switch_id_array = get_switch_id();
    $switch_link_array = get_switch_link();
    $host_switch_link = get_host_switch_link();
    
    //si assegnano al relativo vettore, gli identificatori di ciascun host già ricavati e salvati in $host_switch_link concatenati con gli id degli switch collegati
    foreach($host_switch_link as $key => $value) {

        //gli identificatori sono lunghi 17 caratteri
        $host_id_array[$key]=substr($host_switch_link[$key], 0, 17);
       
    }

    //si ordinano gli id degli host
    sort($host_id_array);

    //si crea un array con i nuovi dati
    $updated_data = array(
        'switch_id_array' => $switch_id_array, 'switch_link_array' =>  $switch_link_array, 'host_switch_link' => $host_switch_link, 'host_id_array' => $host_id_array
    );

    //si restituiscono i dati aggiornati in formato JSON
    header('Content-Type: application/json');
    echo json_encode($updated_data);
?>