<?php
class ModelExtensionVatValidation extends model {	

	public function loadfooterjs() {
		$themenm = 'def';
		$themenm = 'j3';		
		$this->document->addScript('catalog/view/javascript/vat_validation/'.$themenm.'/vat_validation_ue.js');		
	}
}