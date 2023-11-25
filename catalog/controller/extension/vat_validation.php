<?php


ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(-1);


class ControllerExtensionVatValidation extends Controller {	

	public function getcache() {
        
        
        include_once($_SERVER['DOCUMENT_ROOT'] . '/system/library/vatvalidation/vatValidation.class.php');
	            
		$vatValidation = new vatValidation( array('debug' => false) );
		$this->response->addHeader('Content-Type: application/json');
		$this->language->load('extension/vat_validation');
		
		$text_vat_not_found =$this->language->get('text_vat_not_found');			
					
		try
		{
						
			if(isset($this->request->get['keyword'])) {	
			
				$vat = trim($this->request->get['keyword']);
			    
			    $country_id=$this->request->get['country_id'];
			    
				$vatValidation->check("{$country_id}", $vat);
		         
				if($vatValidation->isValid()){
						
					$tk_address = explode('-',$vatValidation->getAddress());
					$full_address = explode(' ',trim($tk_address[0]));
					$length_full_address = count($full_address)-1;

					$tk = trim($full_address[$length_full_address]);
					unset($full_address[$length_full_address]);

					$json['is_valid'] = 1;
					$json['vat'] 	  = $vat;
					$json['company']  = $vatValidation->getDenomination();
					$json['address']  = implode(' ',$full_address);
					$json['tk']		  = $tk;
					$json['doy'] 	  =	trim($tk_address[1]);

				} else {
					$json['is_valid'] = 0;	
					$json['vat'] 	  = $vat;
					$json['error']    = $text_vat_not_found;
					
				}
				
			
			}

		}catch (Exception $e) {
    	   
				$json['is_valid'] = 0;
				$json['vat'] 	  = $vat;
				$json['error']    = $text_vat_not_found;
				
    	            
    	}		
		$this->response->setOutput(json_encode($json)); 
 	}
}