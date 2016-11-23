
   		var nator = window.navigator.userAgent;
   		var Pc =/Mozilla\/5.0/i.test(nator);
   		var Mobile =/Mobile/i.test(nator);
   		var ie =/Mozilla\/4.0/i.test(nator);

window.onload=function(){
	var pc=document.getElementById('pc');
	var moblie=document.getElementById('moblie');
	var nav=document.getElementById('nav');
	if(Pc||Mobile){
		pc.media="only screen and (min-width:980px)";
		moblie.src="";
	}else if(ie){
		pc.media="";
		moblie.src="";
	}
	

}
