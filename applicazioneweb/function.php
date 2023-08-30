<?php
    //resttuisce il numerro di switch, host e link in un array
    function get_summary(){ //http://127.0.0.1:8080/wm/core/controller/summary/json con questo link si riescono ad ottenere il numero di switch, host e link tra switch i quali sono bidirezionali
        
        $url= 'http://127.0.0.1:8080/wm/core/controller/summary/json';

        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);

        curl_close($curl);

        $arr = json_decode($response, true);

        //array contenente il numero di switch, host e link
        $summary=array();

        $summary[0]=0;
        $summary[1]=0;
        $summary[2]=0;
        
        foreach($arr as $key => $value) {
            
            //echo $key."=>".$value;
            if($key=='# Switches'){

                $summary[0]=$value;

            }else if($key=='# hosts'){

                $summary[1]=$value;

            }else if($key=='# inter-switch links'){

                $summary[2]=$value;

            }           
        }
        return $summary;
    }



    
    //ricava gli id di tutti gli switch e li ordina in ordine crescente
    function get_switch_id(){

        ///wm/core/controller/switches/json restituisce gli identificatori di tutti gli switch collegati al controller
        $url= 'http://127.0.0.1:8080/wm/core/controller/switches/json';
        
        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);

        curl_close($curl);

        $arr = json_decode($response, true);

        $switch_id_array=array();
        $count=0;

        //il risultato ottenuto è un array costituito da array nei quali c'è il campo switchDPID che contiene l'ID dello switch
        foreach($arr as $key => $value) {
            
            foreach($value as $key1 => $val) {

                //si salvano solo gli ID degli switch in un array ulteriore
                if($key1=='switchDPID'){

                    $switch_id_array[$count]=$val;
                }
            }

            $count++;
        }
        //ordinamento degli id degli switch in ordine crescente, in modo che vengano inseriti in ordine in tabella
        sort($switch_id_array);

        return $switch_id_array;

    }
    
    

    //ricava i link tra gli switch
    function get_switch_link(){

        ///wm/topology/links/json restituisce i vari link e a quali switch sono collegati
        $url= 'http://127.0.0.1:8080/wm/topology/links/json';
        
        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);

        curl_close($curl);

        $arr = json_decode($response, true);

        $switch_link_array=array();
        $count=0;

        foreach($arr as $key => $value) {
            
            foreach($value as $key1 => $val) {

                //si concatena l'id dello switch sorgente con l'id dello switch di destiazione per ciascun link, separati da un trattino
                
                if($key1=='src-switch'){

                    $switch_link_array[$count]=$val;

                }else if($key1=='dst-switch'){

                    $switch_link_array[$count]= $switch_link_array[$count]."-".$val;
                }
                
            }

            $count++;
        }
        
        return $switch_link_array;
    }     

    //ricava i link tra host e switch
    function get_host_switch_link(){ 


        ///wm/device/ restituisce tutti i dispositivi rilevati dal controllore con relativo indirizzo mac, ipv4, ipv6, porta e identificatore dello switch a cui è collegato
        $url= 'http://127.0.0.1:8080/wm/device/';
        
        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);
        
        curl_close($curl);

        $arr = json_decode($response, true);

        //array che viene restituito dalla funzione, contiene identificatore dell'host concatenato all'id dello switch ad esso collegato
        $host_switch_link=array();

        //stesso contenuto dell'array precedente con l'aggiunta di host che non sono collegati a niente e vengono rilevati dal controllore in alcuni casi
        $host_switch_link1=array();

        $count=0;

        foreach($arr as $key => $value) {
            
            foreach($value as $key1 => $val) {

                foreach($val as $key2 => $val2) {

                    //si concatena l'id dello switch con l'id dell'host a cui è collegato, separati da un trattino
                    
                    if($key2=='mac'){
                        //assegna l'id dello switch al vettore
                        $host_switch_link1[$count]=$val2[0];
    
                    }else if($key2=='attachmentPoint'){

                        foreach($val2 as $key3 => $val3) {
                           
                            foreach($val3 as $key4 => $val4) {
                                
                                if($key4=='switch'){
                                    //concatena l'id dell'host aćollegato a quello switch
                                    $host_switch_link1[$count]= $host_switch_link1[$count]."-".$val4;
                                }
                            }
                        }
                    }
                }
                $count++;
            }

        }

        //le stringhe nel vettore con una lunghezza minore di 41 (l'unica altra lunghezza possibile è 17, ovvero l'id dell'host) vengono rimosse
        //fanno riferimento agli host rilevati dal controllore anche se non sono collegati alla rete
        foreach($host_switch_link1 as $key => $value) {
           
            if(strlen($value)<41){
            
                unset($host_switch_link1[$key]);
               
            }
        }

        //si azzera il contatore perchè tramite la funzione unset vengono rimossi gli elementi del vettore e gli indici potrebbero essere non consecutivi
        $count=0;

        //si assegna il risultato ottenuto al vettore da rstituire e assegnando ad esso indici numerici consecutivi
        foreach($host_switch_link1 as $key => $value) {

            
            $host_switch_link[$count]=$host_switch_link1[$key];
            
            $count++;    

        }

        return $host_switch_link;
    }  




    //restituisce le righe della tabella dei flussi per un singolo switch, in particolare per lo switch $switch_id_array[$i]
    function get_flow_table_row($switch_id_array, $i){

        //array da riempire con i dati da inserire in una singola riga della tabella
        $raw=array();

        //per ciascuno switch si mostrano le statistiche, si utilizzano le api per ogni singolo switch anzichè l api che include tutti gli switch
        $url= 'http://127.0.0.1:8080/wm/core/switch/'.$switch_id_array[$i].'/flow/json';

        //echo "switch_id" . "=>" . $switch_id_array[$i] . "<br>";
        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);

        curl_close($curl);

        $arr = json_decode($response, true);

        //indice da utilizzare per inserire i dati in raw
        $j=1;
           
        foreach($arr as $key => $value) {

            foreach($value as $key1 => $val) {

                //si conta il numero di flussi
                //echo "flow_count" . "=>" . count($value). "<br>";
                $raw[0]=count($value);

                foreach($val as $key2 => $val2) {

                    //il risultato ottenuto contiene solo informazioni che ci interessano
                    if($key2=='packet_count' || $key2=='byte_count' || $key2=='duration_sec'){

                        //echo $key2 . " => " . $val2 . "<br>";
                        $raw[$j]=$val2;
                        $j++;                                
                    }
                }
            }
        }

        return $raw;
    }



    
    //restituisce lo stato di tutte le porte dello switch $switch_id_array[$i] in un array
    function get_port_state($switch_id_array, $i){

        //per ciascuno switch si mostrano le statistiche relative alle porte, si utilizzano le api per ogni singolo switch anzichè l'api che include tutti gli switch
        //in quetso caso si ricava solo lo stato
        $url= 'http://127.0.0.1:8080/wm/core/switch/'.$switch_id_array[$i].'/port-desc/json';
 
        //echo  $url. "<br>";
        $curl = curl_init($url);
  
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
     
        $response = curl_exec($curl);
     
        curl_close($curl);
     
        $arr = json_decode($response, true);

        //array contenente lo stato attivo/non attivo di ogni porta degli switch
        $state=array();
        //indice utilizzato per $state
        $w=0;

        foreach($arr as $key => $value) { 

            foreach($value as $key1 => $val) {
                foreach($val as $key2 => $val2) { 

                    //interessa solo lo stato
                    if( $key2=="state"){
                        //echo $val2[0]."<br>";
                        $state[$w]=$val2[0];
                        $w++;
                        }
                    }
                        
                }
         
            }

        return $state;
    }
    


    
    //restituisce le righe della tabella delle porte dello switch $switch_id_array[$i]
    function get_port_table_raw($switch_id_array, $i){

        //array che contiene le informazioni di un singolo switch
        $single_switch=array();

        //per ciascuno switch si mostrano le statistiche relative alle porte, si utilizzano le api per ogni singolo switch anzichè l'api che include tutti gli switch
        $url= 'http://127.0.0.1:8080/wm/core/switch/'.$switch_id_array[$i].'/port/json';
 
        //echo  $url. "<br>";
        $curl = curl_init($url);
  
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
     
        $response = curl_exec($curl);
     
        curl_close($curl);

        $arr = json_decode($response, true);

        //indice utilizzato per $single_switch
        $k=0;
     

        foreach($arr as $key => $value) {
      
            foreach($value as $key1 => $val) {

                foreach($val as $key2 => $val2) {

                    foreach($val2 as $key3 => $val3) {

                        foreach($val3 as $key4 => $val4) {
                    
                            //gli ultimi 2 campi non servono
                            if($key4!='duration_nsec' && $key4!='properties'){

                                $single_switch[$k]=$val4;
                                
                                $k++;            
                            }    
                        }        
                    }        
                }          
            }
        }

        return  $single_switch;
    } 




//si scambiano 10 elementi del vettore con altri 10 elementi se una porta con numero maggiore precede una porta con numero minore    
function array_sort($single_switch, $single_switch_length){
        $swapped=false;

        do {
            $swapped = false;
            //inizia da 1 dato che i primi 10 elementi riguardano la porta local
            for ($a = 1; $a <  $single_switch_length-1; $a++) {

                if ($single_switch[10*$a] > $single_switch[10*($a+1)]) {
                    $temp = array();

                    for ($j = 0; $j <  10; $j++) { 

                        $temp[$j]=$single_switch[(10*$a)+$j]; 
                    }

                    for ($j = 0; $j <  10; $j++) { 

                        $single_switch[(10*$a)+$j]=$single_switch[(10*($a+1))+$j]; 
                    }

                    for ($j = 0; $j <  10; $j++) { 

                        $single_switch[(10*($a+1))+$j]=$temp[$j]; 
                    }

                    $swapped = true;
                }
            }
        } while ($swapped);

        return $single_switch;
    }

?>