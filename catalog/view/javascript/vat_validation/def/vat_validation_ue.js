var vat_validation_interval = '';
var vat_validation = {
	'getcache': function(thistarget) {


		if(thistarget.val()!=='') {

			var vat_code= thistarget.val().trim();

			$.ajax({
				type: "GET",
				url: "index.php?route=extension/vat_validation/getcache",
				data: 'keyword='+ vat_code +'&country_id=' + $('#validation-country').val(),
			    dataType: 'json',
			    cache: false,
				beforeSend: function() {
					//thistarget.after(' <i class="fa fa-spinner fa-spin"></i>');
				},
				success: function(json) {
					console.log(json);

					let doy= $('#input-payment-custom-field2');
					let vat= $('#input-payment-custom-field1');
					let company= $('#input-payment-custom-field3');
					if(json.is_valid){
						$('#input-payment-company').val(json.company);
						$('#input-payment-company').attr('readonly', true);

						company.val(json.company);
						company.attr("readonly", "true");

						$('#input-payment-address-1').val(json.address);
						$('#input-payment-address-1').attr('readonly', true);

						doy.val(json.doy);
						doy.attr("readonly", "true");


						$('#input-payment-city').val(json.doy);
						$('#input-payment-city').attr('readonly', true);
						$('#input-payment-postcode').val(json.tk);
						$('#input-payment-postcode').attr('readonly', true);
					}else{
						$('#input-payment-company').val('');

						company.val('');

						$('#input-payment-address-1').val('');
						doy.val('');
						$('#input-payment-city').val('');
						$('#input-payment-postcode').val('');
						vat.val(json.error);
					}


				},
				complete: function() {
					//$('.fa-spinner').remove();
				}
			});


		}
	},
	'initjson': function() {
	    //checkingChars(event, c) c [kefalea, oxi ellinika, oxi aritmoi , oxi kena, oxi special char , onlynumbers , arrayChar]

		        let vat=$('#input-payment-custom-field1');

    	        const elem = document.getElementById("btn-afm-validation");

    	        if(elem===null){

        	        vat.before('<span style="padding:3px 0px 0px 0px !important;"><select  id="validation-country" class="form-control" style="width:95% !important;"><option value="EL">EL</option><option value="CY">CY</option></select></span>');

            	    vat.attr("onkeypress", "return checkingChars( event, this, [true, false, false, true, false, false ,[''] ])");

            		//vat.attr("onpaste", "return false");

            	    vat.attr("autocomplete", "nope");

            		vat.attr("maxlength","15");

            		vat.attr("style","width: 80px !important;");


            		vat.after('<span style="padding-left:3px !important;"><button class="btn btn-primary"  id="btn-afm-validation" type="button">Ελεγχος</button></span>');
    	        }

    		vat_validation_interval = setInterval(function(){

    					let btn=$('#btn-afm-validation');

    					btn.on( "click", function() {

                          var cur_vat=$('#input-payment-custom-field1');
                          vat_validation.getcache(cur_vat);

                        });
    					clearInterval(vat_validation_interval);


    		}, 500);



 	}
}

var execute=null;
function checkEventInput(evt,c){
		if( evt.keyCode == 13 ){
			execute();
		}
		if( c[5] ){
			if( (evt.keyCode > 32) && (evt.keyCode < 48 || evt.keyCode > 57) )
				return false;
		}

		if( c[6].length > 0 ){
			var a = c[6];
			for( var i = 0; i<a.length; i++){
				if( isNaN(a[i]) ){
					if( evt.keyCode == parseInt( a[i].charCodeAt(0).toString(10)) )
						return false;
				}
				else
					if(a[i]==evt.keyCode)
						return false;
			}
		}

		if (c[0]){
			var s=String.fromCharCode(evt.keyCode)
			s=s.toUpperCase();
			evt.keyCode = parseInt(s.charCodeAt(0).toString(10));
		}
		if( c[1] )
			if(evt.keyCode > 128)
				return false;

		if( c[2] )
			if(evt.keyCode >= 48 && evt.keyCode <= 57)
				return false;

		if ( c[3] )
			if (evt.keyCode == 32)
				return false;

		if( c[4] )
			if((evt.keyCode > 32) && (evt.keyCode < 47 || evt.keyCode > 57) && (evt.keyCode < 65 || evt.keyCode > 90) && (evt.keyCode < 97 || evt.keyCode > 122) && (evt.keyCode < 128))
				return false;

 }

function checkEventSpecials(evt,obj,c){
	if( evt.which == 13 ){
				execute();
	}
	var s= obj.value
	var start = obj.selectionStart;
	var end = obj.selectionEnd;
	var startText = s.substring( 0 ,start);
	var endText = s.substring(end, s.length);


    if( c[0] ){
		if (evt.which>32){
			obj.value=startText + String.fromCharCode(evt.which).toUpperCase()  + endText;
			obj.selectionStart=start+1;
			obj.selectionEnd=obj.selectionStart;
			return false;
		}
	}
	if(c[1]){
		if(evt.which > 128)
		return false;
	}
	if(c[2]){
		if(evt.which >= 48 && evt.which <= 57){
		 return false;
		}
    }
	if(c[3]){
		if (evt.which == 32)
					return false;
	}
	if(c[4]){
				if((evt.which>32) && (evt.which < 48 || evt.which > 57) && (evt.which < 65 || evt.which > 90) && (evt.which < 97 || evt.which > 122) && (evt.which < 128))
					return false;
	}

    if( c[5] ){
		if( (evt.which > 32)  && (evt.which < 48 || evt.which > 57)) {
			return false;
		}
	}

	if(c[6].length > 0){
		var a = c[6];
		for( var i = 0; i<a.length; i++){
			if( isNaN(a[i]) ){
						if( evt.which == parseInt( a[i].charCodeAt(0).toString(10) ) )
							return false;
			}else{
				if( a[i]==evt.which )return false;
			}
		}
	 }

	return true;
}

function checkingChars(evt,obj, c, ExecFunc){
	try
    {
		if( ExecFunc )
				execute = ExecFunc;
			else
				execute = null;

		if (!evt.which){
			var b = checkEventInput(evt,c);
			if( evt.returnValue )
					evt.returnValue = b;
				else
			return b;
		}else{

			return checkEventSpecials(evt,obj,c);
		}

	}catch(e){
	   //retun errors
	   console.log(e);
	}
}

$(document).ready(function() {
  vat_validation.initjson();

});


$(document).ajaxStop(function() {
    vat_validation.initjson();
});


