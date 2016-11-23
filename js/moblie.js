window.onload=function(){
	var ion=document.getElementById('cion');
	var nav=document.getElementById('nav')
	var onoff=true;
	var browserWidth=window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	window.onresize = function(){	
		browserWidth=window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		if(browserWidth>980){
			nav.style.display='block';
		}
		//console.log(browserWidth)
	}
	ion.onclick=function(){
		if(browserWidth<980){
			if(onoff){
				nav.style.display='block';
				onoff=false;
				
			}else{
				nav.style.display='none';
				onoff=true;
			}
		}else{
			nav.style.display='block';
		}
	}
	console.log(browserWidth)
};
