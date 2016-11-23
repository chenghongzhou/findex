;(function ($, document, window) {
	var jaPage = 'jaPage',
	wh = $(window).height(),
	_this,
	page,
	len,
	top,
	jaDiv,
	pm,
	url,
	btop,
	atop,
	delta,
	type,
	$obj,
	$data,
	$val,
	$kjdx,
	$lxfs,
	$loaded=true,
	loaded = true,
	$default = {'age':'18','height':'150','weight':'40','sexual':'','marriage':'','edu':'','zhiye':''},
	$def = {'height':'[name="height1"],[name="height2"]','weight':'[name="weight1"],[name="weight2"]','sexual':'#sexual','marriage':'[name="marriage_c"]','edu':'[name="edu_c"]','zhiye':'[name="zhiye_c"]'}
	pm = $.fn[jaPage] = $[jaPage] = function(options,callback){
		typeof this != 'function'?_this=$(this):_this=$("#cmain");
		if(options&&options.page){
			page = options.page;
			url = options.url;
		}else{
			return false;
		}
		$obj = _this.children().last();
		$obj[0]?top = $obj.offset().top:$loaded = false;
		btop = $(window).scrollTop();
		if(options.html&&options.html=='index'){
			for(var i in $default){
				setDefault(i);
			}
			$val = getIndexData();
			
			$(document).on("click",'.vip_cs_new',function(){
				if(myuser.vip < 1){
					$.jabox.chtml['notvip2']  = '<div class="jaAll" style="padding-bottom: 12px;">'
					+'<p class="jaLineTo mtop10 center">该功能仅限VIP1及以上会员使用！</p>'
					+'<div class="center" style="margin-top:30px;margin-bottom:15px;"><a href="/vip/view/id/1.html" class="jaBtn ja_cBtn">开通VIP</a></div>'
					+'</div>';
					$.jabox({type:'notvip2'});
					return false;
				}
			});
			// $(document).on("click",'#ja-button,#order .btn',function(){
			$(document).on("click",'#ja-button',function(){
				if(loaded){
					$('#y_sel_mo').removeClass('y_sel_mo1');
					$('#y_sel_mo .y_sel_t').html('更多条件');
					loaded = false;
					$loaded = false;
					type = getType($(this));
					$val = getIndexData();
					if($val['sex']==1){
						$("#cfphs").show();
						$("#zcphs").hide()
					}else{
						$("#zcphs").show()
						$("#cfphs").hide();
					}
					if(1||type){
						$val['type'] = type;
						if($(this).attr("id")=="ja-button"){
							if($("#ja_s_slide .i_d").hasClass('i_u'))$val['ctype']=1;
							$val['pname'] = $('#ja-input').val();
							/* $("#cmain").prepend($("<div class='center'>正在加载中，请稍后!</div>"));
							$.post(url,$val,function(data){
								if(data){
									$("#cmain").html(data);
								}else{
									$("#cmain").html("<div>没有搜索结果</div>");
								}
								delete $val['ctype'];
								top = $("#cmain").children().last().offset().top;
								$loaded = true;
								loaded = true;
							}); */
							var search_string = '';
							for(var item in $val){
								if($val[item] != undefined && $val[item] != ''){
									if(item=='type'){
										continue;
									}else if((item == 'age1' && $val[item] == 18) || (item == 'height1' && $val[item] == 150) || (item == 'weight1' && $val[item] == 40)){
										continue;
									}
									search_string += '<input type="hidden" name="'+item+'" value="'+$val[item]+'" />';
								}
							}
							$('#index_search_form').html(search_string).submit();
							
						}else{
							$("#cmain").load(url,$val,function(){
								delete $val['ctype'];
								if($("#cmain").children().length>0){
									top = $("#cmain").children().last().offset().top;
								}
								$loaded = true;
								loaded = true;
							})
						}
					}else{
						$loaded = true;
						loaded = true;
					}

				}
			})
		}else{
			var $url = options.url||window.location.href;
			var put = options.put||'sex'
			$val = options.data||{};
			$("input[name='"+put+"']").prop('checked',false);
			$("input[name='"+put+"']").on('change',function(){
				$val[put] = $(this).val();
				delete $val['page'];
				delete $val['pid'];
				$("#cmain").load($url,$val,function(data){
					$loaded = true;
					if(data){
						top = $("#cmain").children().last().offset().top;
					}
				})
			})
		}

		$(window).scroll(function(){
			if($(window).scrollTop()>top-wh&&$loaded&&!options.index_load){
				atop = $(window).scrollTop();
				delta = atop - btop;
				btop = atop;

				if(delta>0){
					$loaded = false;
					if(options.page == 'id'){
						var pageId = $("#cmain").children().last();
						$val["pid"] = pageId.data("pid");
					}else{
						$val['page'] = Math.ceil(_this.children().length/page)+1;
					}
					//分页
					_this.append(jaDiv = $("<div class='center'>正在加载中，请稍后!</div>"));
					$.post(url,$val,function(data){
						if(data){
							jaDiv.remove();
							_this.append(data);
							$obj = _this.children().last();
							top = $obj.offset().top;
							$loaded = true;
							if ($.isFunction(callback)) {
								callback();
							}
						}else{
							jaDiv.html("<div class='center'>已经是最后一条了!</div>");
							$loaded = false;
						}
					});
				}
			}
		})
	}
	function getType(obj){
		var $type;
		var index = 1;
		if(obj.hasClass("o_lg")){
			if(!obj.hasClass("o_cur")){
				index = $("#order .btn").index($("#order .o_cur"));
				$("#order .o_cur").removeClass('o_cur');
				obj.addClass("o_cur");
			}
			$type = obj.data("type");
		}else{
			$type=$("#order .o_cur").data('type');
		}
		return $type;
	}
	function getIndexData(){
		var $data;
		if(myuser.uid){
			$data = pm.getData(12);
		}else{
			$data = pm.getData(6);
		}
		$data['type']=getType($("#order .o_cur"));
		return $data;
	}
	function getNext(id){
		for(var i in $default){
			if($('#'+i).hasClass('y_sel1')){
				$("#y_index_line").append($('#'+i));
			}
		}
	}
	function setDefault(id){
		if(id=='age'||id=='height'||id=='weight'){
			var z1=id+1,z2=id+2;
			$('[name="'+z1+'"]').val($default[id]);
			$('[name="'+z2+'"]').val('');
		}
		if(id=='marriage'||id=='edu'||id=='zhiye'){
			$('[name="'+id+'_c'+'"]').prop('checked',false).eq(0).prop('checked',true);
		}
	}
	$(document).on('click','.y_sel_del',function(e){
		//if();
		var id = $(this).parent().attr('id');
		if(id=='sexual'){
			$("#sexual").data('value','');
			$("#sexual").trigger('change');
		}else{
			setDefault(id);
			$($def[id]).trigger('change');
		}
		$(this).parent().addClass('y_sel1');
		getNext();
		$(this).hide();
		e.stopPropagation();
	})
	pm.getData=function(num){
		var $data = ['province','city','area','age','photo','sex','height','weight','sexual','marriage','edu','zhiye'];

		var $val = {};
		$("#y_index_line").hide();
		var def = $default;
		delete def['age'];
		for(var i in def){
			var n = $('#'+i);
			if($default[i]==n.data('value')){
				if(!n.hasClass('y_sel1')){
					n.addClass('y_sel1');
					getNext();
				}
			}else{
				n.show().removeClass('y_sel1').insertBefore("#y_sel_mo");
			}
		}
		for(var i=0;i<num;i++){
			if($data[i]=='age'||$data[i]=='height'||$data[i]=='weight'){
				var b=String($('#'+$data[i]).data('value')).split(','),b1 = $data[i]+1,b2=$data[i]+2;
				if(b.length==1){
					$val[b1]=b[0];
					$val[b2]='';
				}else{
					$val[b1]=b[0];
					$val[b2]=b[1];
				}
			}else{
				$val[$data[i]]=$('#'+$data[i]).data('value');

			}
		}
		return $val;
	}
}(jQuery, document, window));

;(function ($, document, window) {
	var obj = {'2':{'p':'北京','c':{'37':'北京'}},'3':{'p':'上海','c':{'38':'上海'}},'4':{'p':'天津','c':{'39':'天津'}},'5':{'p':'广东','c':{'40':'广州','41':'韶关','42':'深圳','43':'珠海','44':'汕头','45':'佛山','46':'江门','47':'湛江','48':'茂名','49':'肇庆','50':'惠州','51':'梅州','52':'汕尾','53':'河源','54':'阳江','55':'清远','56':'东莞','57':'中山','58':'潮州','59':'揭阳','60':'云浮'}},'6':{'p':'浙江','c':{'61':'杭州','62':'宁波','63':'温州','64':'嘉兴','65':'湖州','66':'绍兴','67':'金华','68':'衢州','69':'舟山','70':'台州','71':'丽水'}},'7':{'p':'江苏','c':{'72':'南京','73':'无锡','74':'徐州','75':'常州','76':'苏州','77':'南通','78':'连云港','79':'淮安','80':'盐城','81':'扬州','82':'镇江','83':'泰州','84':'宿迁'}},'8':{'p':'山东','c':{'85':'济南','86':'青岛','87':'淄博','88':'枣庄','89':'东营','90':'烟台','91':'潍坊','92':'济宁','93':'泰安','94':'威海','95':'日照','96':'莱芜','97':'临沂','98':'德州','99':'聊城','100':'滨州','101':'菏泽'}},'9':{'p':'重庆','c':{'102':'天津'}},'10':{'p':'四川','c':{'103':'成都','104':'自贡','105':'攀枝花','106':'泸州','107':'德阳','108':'绵阳','109':'广元','110':'遂宁','111':'内江','112':'乐山','113':'南充','114':'眉山','115':'宜宾','116':'广安','117':'达州','118':'雅安','119':'巴中','120':'资阳','121':'阿坝州','122':'甘孜州','123':'凉山州'}},'11':{'p':'湖北','c':{'124':'武汉市','125':'黄石','126':'十堰','127':'宜昌','128':'襄樊','129':'鄂州','130':'荆门','131':'孝感','132':'荆州','133':'黄冈','134':'咸宁','135':'随州','136':'恩施州',"1197":"仙桃市","1198":"潜江市","1199":"天门市","1200":"神农架林"}},'12':{'p':'湖南','c':{'138':'长沙','139':'株洲','140':'湘潭','141':'衡阳','142':'邵阳','143':'岳阳','144':'常德','145':'张家界','146':'益阳','147':'郴州','148':'永州','149':'怀化','150':'娄底','151':'湘西自治州'}},'13':{'p':'河北','c':{'152':'石家庄','153':'唐山','154':'秦皇岛','155':'邯郸','156':'邢台','157':'保定','158':'张家口','159':'承德','160':'沧州','161':'廊坊','162':'衡水'}},'14':{'p':'河南','c':{'163':'郑州','164':'开封','165':'洛阳','166':'平顶山','167':'安阳','168':'鹤壁','169':'新乡','170':'焦作','171':'濮阳','172':'许昌','173':'漯河','174':'三门峡','175':'南阳','176':'商丘','177':'信阳','178':'周口','179':'驻马店'}},'15':{'p':'安徽','c':{'180':'合肥','181':'芜湖','182':'蚌埠','183':'淮南','184':'马鞍山','185':'淮北','186':'铜陵','187':'安庆','188':'黄山','189':'滁州','190':'阜阳','191':'宿州','192':'巢湖','193':'六安','194':'亳州','195':'池州','196':'宣城'}},'16':{'p':'福建','c':{'197':'福州','198':'厦门','199':'莆田','200':'三明','201':'泉州','202':'漳州','203':'南平','204':'龙岩','205':'宁德'}},'17':{'p':'江西','c':{'206':'南昌','207':'景德镇','208':'萍乡','209':'九江','210':'新余','211':'鹰潭','212':'赣州','213':'吉安','214':'宜春','215':'抚州','216':'上饶'}},'18':{'p':'山西','c':{'217':'太原','218':'大同','219':'阳泉','220':'长治','221':'晋城','222':'朔州','223':'晋中','224':'运城','225':'忻州','226':'临汾','227':'吕梁'}},'19':{'p':'辽宁','c':{'228':'沈阳','229':'大连','230':'鞍山','231':'抚顺','232':'本溪','233':'丹东','234':'锦州','235':'营口','236':'阜新','237':'辽阳','238':'盘锦','239':'铁岭','240':'朝阳','241':'葫芦岛'}},'20':{'p':'吉林','c':{'242':'长春','252':'四平','253':'辽源','254':'通化','255':'白山','256':'松原','257':'白城','258':'延边州','2904':'吉林'}},'21':{'p':'黑龙江','c':{'259':'哈尔滨','260':'齐齐哈尔','261':'鸡西','262':'鹤岗','263':'双鸭山','264':'大庆','265':'伊春','266':'佳木斯','267':'七台河','268':'牡丹江','269':'黑河','270':'绥化','271':'大兴安岭'}},'22':{'p':'广西','c':{'272':'南宁','273':'柳州','274':'桂林','275':'梧州','276':'北海','277':'防城港','278':'钦州','279':'贵港','280':'玉林','281':'百色','282':'贺州','283':'河池','284':'来宾','285':'崇左'}},'23':{'p':'海南','c':{'286':'海口','287':'三亚',"2409":"五指山市","2410":"琼海市","2411":"儋州市","2412":"文昌市","2413":"万宁市","2414":"东方市","2415":"定安县","2416":"屯昌县","2417":"澄迈县","2418":"临高县","2419":"白沙县","2420":"昌江县","2421":"乐东县","2422":"陵水县","2423":"保亭县","2424":"琼中县","2425":"岛屿",}},'24':{'p':'贵州','c':{'289':'贵阳','290':'六盘水','291':'遵义','292':'安顺','293':'铜仁','294':'黔西南州','295':'毕节','296':'黔东南州','297':'黔南州'}},'25':{'p':'云南','c':{'298':'昆明','299':'曲靖','300':'玉溪','301':'保山','302':'昭通','303':'丽江','304':'思茅','305':'临沧','306':'楚雄州','307':'红河州','308':'文山州','309':'西双版纳','310':'大理州','311':'德宏州','312':'怒江州','313':'迪庆州'}},'26':{'p':'陕西','c':{'314':'西安','315':'铜川','316':'宝鸡','317':'咸阳','318':'渭南','319':'延安','320':'汉中','321':'榆林','322':'安康','323':'商洛'}},'27':{'p':'甘肃','c':{'324':'兰州','325':'嘉峪关','326':'金昌','327':'白银','328':'天水','329':'武威','330':'张掖','331':'平凉','332':'酒泉','333':'庆阳','334':'定西','335':'陇南','336':'临夏州','337':'甘南州'}},'28':{'p':'内蒙古','c':{'338':'呼和浩特','339':'包头','340':'乌海','341':'赤峰','342':'通辽','343':'鄂尔多斯','344':'呼伦贝尔','345':'巴彦淖尔','346':'乌兰察布','347':'兴安盟','348':'锡林郭勒盟','349':'阿拉善盟'}},'29':{'p':'宁夏','c':{'350':'银川','351':'石嘴山','352':'吴忠','353':'固原','354':'中卫'}},'30':{'p':'新疆','c':{'355':'乌鲁木齐','356':'克拉玛依','357':'吐鲁番','358':'哈密','359':'昌吉州','360':'博尔塔拉州','361':'巴音郭楞州','362':'阿克苏','363':'克孜勒苏柯尔克孜州','364':'喀什','365':'和田','366':'伊犁州','367':'塔城','368':'阿勒泰',"369":"石河子市","370":"阿拉尔市","371":"图木舒克市","372":"五家渠市"}},'31':{'p':'青海','c':{'373':'西宁','374':'海东','375':'海北州','376':'黄南州','377':'海南州','378':'果洛州','379':'玉树州','380':'海西州'}},'32':{'p':'西藏','c':{'381':'拉萨','382':'昌都','383':'山南','384':'日喀则','385':'那曲','386':'阿里','387':'林芝'}},'33':{'p':'香港','c':{'2938':'香港'}},'34':{'p':'澳门','c':{'2940':'澳门'}},'35':{'p':'台湾','c':{'2942':'台湾'}}};
	var p=$("#province"),
	c=$("#city"),
	a=$("#area"),
	ps = p.children('.y_sel_c'),
	cs = c.children('.y_sel_c'),
	as = a.children('.y_sel_c'),
	is = '<i class="i_ar" data-value="{#1}">{#2}</i>',
	area,
	tsel = {'age':$('[name="age2"]').children().clone(),'height':$('[name="height2"]').children().clone(),'weight':$('[name="weight2"]').children().clone()},
	tst = {'age':'岁','height':'cm','weight':'kg'};

	function getProvince(){
		var html = '';
		if(p.data('value')==''){
			html += is.replace('i_ar','i_ar i_ar_c').replace('{#1}','').replace('{#2}','全国');
		}else{
			html += is.replace('{#1}','').replace('{#2}','全国');
		}
		for(var i in obj){
			if(i==p.data('value')){
				html += is.replace('i_ar','i_ar i_ar_c').replace('{#1}',i).replace('{#2}',obj[i]['p']);
			}else{
				html += is.replace('{#1}',i).replace('{#2}',obj[i]['p']);
			}
		}
		ps.children('.y_ar').append(html);
	}
	function getArea(){
		var v = c.data('value'),html = '<i class="i_ar i_ar_c" data-value="">不限</i>';
		if(v!=''){
			if(area[v]){
				for(var i in area[v]){
					html += is.replace('{#1}',i).replace('{#2}',area[v][i]);
				}
				// $("#area").show().data('value','').find('.y_sel_t').text('不限');
				$("#area").data('value','').find('.y_sel_t').text('不限');
				// $("#area").show().find('.y_ar').html('').append(html);
				$("#area").find('.y_ar').html('').append(html);
			}else{
				$("#area").data('value','').hide().find('.y_sel_t').text('不限');
			}
		}else{
			// $("#area").show().data('value','').find('.y_sel_t').text('不限');
			$("#area").data('value','').find('.y_sel_t').text('不限');
			// $("#area").show().find('.y_ar').html('<i class="i_ar1">请先选择省份和城市</i>');
			$("#area").find('.y_ar').html('<i class="i_ar1">请先选择省份和城市</i>');
		}
	}
	$.fn['jaSel'] = $['jaSel'] = function(options,callback){
		//这里是仿下拉框
		getProvince();
		p.on('change',function(){
			$("#area").hide();
			var v = p.data('value'),html='<i class="i_ar i_ar_c" data-value="">不限</i>';
			if(v!=''){
				if(obj[v]){
					for(var i in obj[v]['c']){
						html += is.replace('{#1}',i).replace('{#2}',obj[v]['c'][i]);
					}
					$("#city").data('value','').find('.y_sel_t').text('不限');
					$("#city").find('.y_ar').html('').append(html);
				}else{
					$("#city").data('value','').find('.y_sel_t').text('不限');
					$("#city").find('.y_ar').html('<i class="i_ar1">您选择的省份暂时没有添加城市</i>');
				}
			}else{
				$("#city").data('value','').find('.y_sel_t').text('不限');
				$("#city").find('.y_ar').html('<i class="i_ar1">请先选择省份</i>');
			}
			var gcity = {2:37,3:38,4:39,9:102};
			if(v==2||v==3||v==4||v==9){
				$("#city").data('value',gcity[v]).hide().trigger('change');
				$("#area").show();
			}else{
				$("#city").show().data('value','').find('.y_sel_t').text('不限').trigger('change');
			}
		})
		c.on('change',function(){
			//console.log('城市改变了，需要重新赋值和重置地区');
			if(typeof area == 'undefined'){
				$.getJSON('/Public/js/jaArea.js',function(data){
					area = data;
					getArea();
				})
			}else{
				getArea();
			}

		})
		$("#sexual").on('change',function(){
			if($(this).data('value')==''){
				$(this).find('.y_sel_t').text('性取向');
				$(this).find('.i_ar').removeClass('i_ar_c').eq(0).addClass('i_ar_c');
			}
		})
		$(document).on('change',"input[name='zhiye_c'],input[name='marriage_c'],input[name='edu_c']",function(){
			var ctext = {'zhiye':'职业','marriage':'婚史','edu':'学历'};
			var na = $(this).attr('name').replace("_c","");
			if($(this).val()!=""){
				$("input[name='"+$(this).attr('name')+"']").eq(0).prop('checked',false);
			}else{
				$("input[name='"+$(this).attr('name')+"']").prop('checked',false);
				$(this).prop('checked',true);
			}
			var $obj = $("input[name='"+$(this).attr('name')+"']:checked"),val="",text="";
			if($obj.length == 0){
				$("input[name='"+$(this).attr('name')+"']").eq(0).prop('checked',true);
				val = ''
				text = ctext[na];

			}else{
				var textarr = [];
				$obj.each(function(e) {
					val += $obj.eq(e).val();
					if(e<2){
						textarr.push($obj.eq(e).next("label").text());
					}
				});
				text += textarr.join('/');
			}
			if($obj.length>2){
				text += "..."
			}

			if(val == ''){
				text = ctext[na];
			}
			if(val == '12345'&&na=='marriage'){
				val = '';
				text = ctext[na];
				$("input[name='"+$(this).attr('name')+"']").prop('checked',false).eq(0).prop('checked',true);
			}
			if(val=='1235678'||val=='abcdefghijkl'){
				val = '';
				text = ctext[na];
				$("input[name='"+$(this).attr('name')+"']").prop('checked',false).eq(0).prop('checked',true);
			}

			$("#"+na).data('value',val);
			$(this).parents('.y_sel_c').prev().children('.y_sel_t').eq(0).text(text);
		})
		$(document).on('change','[name="age1"],[name="age2"],[name="height1"],[name="height2"],[name="weight1"],[name="weight2"]',function(){
			var n = $(this).attr('name'),
			v = $(this).val(),
			z = n.match(/age|height|weight|[0-9]/ig),
			o1 = $('[name="'+z[0]+'1"]'),
			o2 = $('[name="'+z[0]+'2"]'),
			v1 = parseInt(o1.val()),
			v2 = o2.val()==''?'':parseInt(o2.val());
			if(z[1]==1){
				o2.children().remove();
				o2.append(tsel[z[0]]);
				o2.children('option').each(function(e){
					if($(this).val()<=v1&&$(this).val()!='')$(this).remove();
				});
				(v1>=v2&&v2!='')?o2.val(''):o2.val(v2);
			}
			if(o2.val()==''){
				$('#'+z[0]).data('value',v1);
				$('#'+z[0]).find('.y_sel_t').text(v1+tst[z[0]]+'-不限');
			}else{
				$('#'+z[0]).data('value',v1+','+o2.val());
				$('#'+z[0]).find('.y_sel_t').text(v1+'-'+o2.val()+tst[z[0]]);
			}
		})
		$(document).on('click','.y_sel_b',function(){
			$(this).parents('.y_sel_c').hide();
		})
		$(document).on('click','.i_ar',function(){
			var g = $(this).parent(),
			gv = g.data('value'),
			v = $(this).data('value');
			if(v!=$("#"+gv).data('value')){
				var text = $(this).text();
				g.parent().prev().children('.y_sel_t').text(text);
				g.children('.i_ar').removeClass('i_ar_c');
				$(this).addClass('i_ar_c');
				$("#"+gv).data('value',v).trigger('change');
			}
			$(this).parents('.y_sel_c').hide();
		})
		$(document).on('click','.y_sel_btn',function(e){
			if($(this).next().is(":visible")){
				$(this).next().hide()
			}else{
				$("#y_selbox .y_sel_c").hide();
				$(this).next().show()
			}
			$(document).one("click", function(){
				$("#y_selbox .y_sel_c").hide();
			});
			e.stopPropagation();
		})
		$(document).on("click",'.y_sel', function(e){
			e.stopPropagation();
		});
		$(document).on('click','.y_sel_mo',function(){
			if(myuser.uid){
				if($(this).hasClass('y_sel_mo1')){
					$(this).removeClass('y_sel_mo1');
					$(this).children('.y_sel_t').html('更多条件');
					$("#y_index_line").hide();
				}else{
					$(this).addClass('y_sel_mo1');
					$(this).children('.y_sel_t').html('收起条件');
					$("#y_index_line").show();
				}
			}else{
				$.jabox({type:'nologin',title:'会员登录'});
			}
		})

		$(document).on('mouseover','.y_sel',function(){
			if(!$(this).hasClass('y_sel1')){
				$(this).children('.y_sel_del').show();
			}
		})
		$(document).on('mouseout','.y_sel',function(){
			$(this).children('.y_sel_del').hide();
		})
		$(document).on('mouseover','.y_sel1 .y_sel_btn',function(){
			$(this).addClass('y_sel_btnh')
		})
		$(document).on('mouseout','.y_sel1 .y_sel_btn',function(){
			$(this).removeClass('y_sel_btnh')
		})
	}

	$.fn['getCity'] = $['getCity'] = function(options,callback){
		var pd = $('[name="province"]'),
		cd = $('[name="city"]'),
		ad = $('[name="area"]');

		var def;
		if(typeof options!='undefined'){
			def = options||options['default']||{p:pd.val(),c:cd.val(),a:ad.val()};
		}else{
			def ={p:pd.val(),c:cd.val(),a:ad.val()};
		}
		var prov_a='';
		if(def.p == '')prov_a+='<option value="" '+selected+'>不限</option>';
		for(var i in obj){
			var selected='';
			if(i==def.p)selected='selected=selected';
			prov_a+='<option value="'+i+'" '+selected+'>'+obj[i]['p']+'</option>';
		}
		pd.html('').append(prov_a);
		getCitya(pd.val());
		function getCitya(val){
			var city_a ='',ncity = obj[val],selected='';
			if(val!=''){
				if(def.c=='')city_a+='<option value="" '+selected+'>不限</option>';
				for(var i in ncity['c']){
					i==def.c?selected = 'selected=selected':selected='';
					city_a += '<option value="'+i+'" '+selected+'>'+ncity['c'][i]+'</option>'
				}
			}else{
				city_a += '<option value="" '+selected+'>不限</option>'
			}
			cd.html('').append(city_a);
			if(typeof area == 'undefined'){
				$.getJSON('/Public/js/jaArea.js',function(data){
					area = data;
					getCarea(cd.val())
				});
			}else{
				getCarea(cd.val());
			}

		}
		function getCarea(val){
			var narea = area[val],area_a='',selected='';
			for(var i in narea){
				i==def.a?selected = 'selected=selected':selected='';
				area_a += '<option value="'+i+'" '+selected+'>'+narea[i]+'</option>'
			}
			ad.html('').append(area_a);
		}
		$(document).on('change','[name="province"]',function(){
			var v = $(this).val()
			if(v==2||v==3||v==4||v==9){
				$('[name="city"]').hide();
			}else{
				$('[name="city"]').show();
			}
			getCitya(v);
		})
		$(document).on('change','[name="city"]',function(){
			getCarea($(this).val());
		})
	}

}(jQuery, document, window));
;(function ($, document, window) {
	$.fn['timeView']=$['timeView']=function(options,callback){
		var t = $("#itime").data('time'),
		ids = ['i_th','i_sh','i_tm','i_sm','i_ts','i_ss'],
		T;
		init();
		function init(){
			if(t<86400){
				//显示倒计时
				T = setInterval(formatTime,1000);
			}

		}
		function formatTime(){
			var h,m,s,g;
			h = parseInt(t/3600);
			g = parseInt(t%3600);
			m = parseInt(g/60);
			s = parseInt(g%60);
			if(t<=0){
				clearInterval(T);
				var dd = $("#itime").parent();
				dd.prepend('<i class="im i_m2"></i>');
				$("#itime").remove();
				return false;
			}
			t--;
			$("#i_th").attr('class','iu i_u'+parseInt(h/10));
			$("#i_sh").attr('class','iu i_u'+parseInt(h%10));
			$("#i_tm").attr('class','iu i_u'+parseInt(m/10));
			$("#i_sm").attr('class','iu i_u'+parseInt(m%10));
			$("#i_ts").attr('class','iu i_u'+parseInt(s/10));
			$("#i_ss").attr('class','iu i_u'+parseInt(s%10));
		}
		function getNum(num){
			var t,s
			t = parseInt(num/10);
			s = num%10;
			return t+''+s
		}

	}
}(jQuery, document, window));
;(function ($, document, window) {
	$.fn['japl'] = $['japl'] = function (options, callback) {
		$(document).on('click','.com',function(){
			//弹出评论
			if(myuser.uid){
				var ele = "",
				_this =$(this).parent();
				if(!_this.data('id')){_this=_this.parent()}
				getPl(_this);
			}else{
				$.upbox({html:true,ctype:'nologin',title:"会员登录"})
			}
		});
		$(document).on('mouseover','.ja_pline',function(){
			if($(this).children().eq(0).hasClass('ja_pncm')&&$(this).find('.jahf').length==0){
				$(this).append('<span class="jahf">回复</span>')
			}
			$(this).find(".jahf").show();
		})
		$(document).on('mouseout','.ja_pline',function(){
			if($(this).find('.jahf').length==1){
				$(this).find(".jahf").hide();
			}
		})
		$(document).on('click','.jahf',function(){
			var _this = $(this).parent().parent();
			var tobj = $(this).parent().children().eq(0);
			if(!_this.data('id')){_this=_this.parent()}
			getPl(_this,tobj);
		})
		$(document).on('click','.com_cm',function(){
			//评论发布
			var url = '/index.php?s=/Ajax/InsertPl',
			_this = $(this).parent().prevAll(".ja_udata"),
			_that = $(this).parent(),
			$data = {id:_this.data('id'),type:_this.data('type'),uid:_this.data('uid'),content:$(this).prev().children(".ja_c_text").val()};
			if(_that.find(".ja_chf").data("tuid")){
				$data['tuid'] = _that.find(".ja_chf").data("tuid");
				$data['tname']= _that.find(".ja_chf").text().replace("回复 ","").replace("：","");
			}
			if($data['content']){
				$.post(url,$data,function(data){
					if(data.code==200){
						var div;
						if($data['tuid']){
							div = '<div class="ja_pline"><span class="ja_pn">我</span><span class="ja_hf">回复</span><span data-tuid="'+$data['tuid']+'" class="ja_pn ja_pncm">'+$data['tname']+'：</span><span class="ja_pd">'+$data['content']+'</span></div>';
						}else{
							div = $('<div class="ja_pline"><span class="ja_pn">我：</span><span class="ja_pd">'+$data['content']+'</span></div>');
						}
						if(_that.prev().hasClass('ja_pl')){
							//原先有评论
							_that.prev().append(div);
							_that.remove();
						}else{
							//原先没有评论
							_that.before(jaPl = $('<div class="ja_pl"></div>'));
							jaPl.append(div)
							_that.remove();
						}
						_this.find('.com span').html(parseInt(_this.find('.com span').html())+1)
						$.upbox({html:"发布评论成功!",closeButton:false,className:"upbox",titleShow:false,onComplete:function(){
							$("#xccode").remove();
							setTimeout(function(){
								$.upbox.close();
							},2000)
						}});
					}else{
						$.upbox({html:"发布评论错误!",closeButton:false,className:"upbox",titleShow:false,onComplete:function(){
							$("#xccode").remove();
							setTimeout(function(){
								$.upbox.close();
							},2000)
						}});
					}
				})
			}else{
				$(this).parent().remove();
			}
		})

		function getPl(obj,tobj){
			var tl={};
			if(!obj.next().hasClass('ja_pl')){
				$.post('index.php?s=Square/Pinlun',{id:obj.data('id'),uid:obj.data('uid'),type:obj.data('type')},function(data){
					if(data){
						obj.after($('<div class="ja_pl"></div>'));
						obj.next('.ja_pl').append(data);
					}
				})
			}

			var ele = $('<div class="ja_comment"><div class="ja_cip"><span class="ja_chf" data-tuid=""></span><input type="text" placeholder="写点什么吧..." class="ja_c_text" name="jcom" maxlength="120"></div><a class="btn blue_btn com_cm" href="javascript:;">发布</a></div>');
			if(obj.parent().find(".ja_comment").length==0){
				obj.after(ele);
			}
			var cw = obj.parent().find(".ja_comment").eq(0).find('.ja_chf');
			var iw = obj.parent().find(".ja_comment").eq(0).find('.ja_c_text').eq(0);
			if(tobj){
				cw.data('tuid',tobj.data('tuid'));
				cw.text("回复 "+tobj.text().replace("：","")+"：");
				iw.width(cw.parent().width()-15-cw.width());
			}else{
				cw.data('tuid',"");
				cw.text("");
				iw.width(cw.parent().width()-15);
			}
			iw.focus();
		}
		var _t={};
		$(document).on('keydown','input[name="jcom"]',function(e){
			var keycode = e.which;
			if(keycode==8&&$(this).val()==""&&$(this).prev().text()!=""){
				if(!$(this).prev().hasClass("ja_ch2")){
					$(this).prev().addClass("ja_ch2");
				}else{
					_t[$(this)]=true;
				}
			}else{
				$(this).prev().removeClass("ja_ch2");
				_t[$(this)]=false;
			}
		})
		$(document).on('keyup','input[name="jcom"]',function(e){
			var keycode = e.which,
			_this = $(this);
			if(keycode==8&&_this.prev().text()!=""&&_t[$(this)]){
				_this.prev().text("").data("tuid","").removeClass("ja_ch2");
			}
		})
		function doKey(e) {
			var ev = e || window.event; //获取event对象
			var obj = ev.target || ev.srcElement; //获取事件源
			var t = obj.type || obj.getAttribute('type'); //获取事件源类型
			if (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea") {
				return false;
			}
		}
	}
}(jQuery, document, window));

;(function ($, document, window) {
	var defaults = {
		html:'',
		type:'tips',
		transition: "elastic",
		speed: 300,
		fadeOut: 300,
		width: false,
		initialWidth: "600",
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: "450",
		innerHeight: false,
		maxHeight: false,
		opacity: 0.7,
		className: 'jabox',
		escKey: true,
		scrolling: true,
		overlayClose: false,
		top: false,
		bottom: false,
		left: false,
		right: false,
		fixed: false,
		data: undefined,
		closeButton: true,
		open: false,
		reposition: true,
		close: '<i class="icon i_cclose"></i>',
		xhrError: "This content failed to load.",

		// accessbility
		returnFocus: false,
		trapFocus: true,

		// callbacks
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,

		title: function() {
			return this.title;
		}
	},
	upbox = 'jabox',
	prefix = 'jbox',
	boxElement = prefix + 'Element',

	// Events
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',

	$overlay,
	$box,
	$wrap,
	$content,
	$related,
	$window,
	$loaded,
	$loadingBay,
	$loadingOverlay,
	$title,
	$current,
	$close,
	$groupControls,
	$events = $('<a/>'), // $({}) would be prefered, but there is an issue with jQuery 1.4.2

	// Variables for cached values or use across multiple functions
	settings,
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	index,
	open,
	active,
	closing,
	loadingTimer,
	publicMethod,
	div = "div",
	requests = 0,
	previousCSS = {},
	init;

	function $tag(tag, id, css) {
		var element = document.createElement(tag);

		if (id) {
			element.id = prefix + id;
		}

		if (css) {
			element.style.cssText = css;
		}

		return $(element);
	}

	function winheight() {
		return window.innerHeight ? window.innerHeight : $(window).height();
	}

	function Settings(element, options) {
		if (options !== Object(options)) {
			options = {};
		}

		this.cache = {};
		this.el = element;

		this.value = function(key) {
			var dataAttr;

			if (this.cache[key] === undefined) {
				dataAttr = $(this.el).attr('data-ubox-'+key);

				if (dataAttr !== undefined) {
					this.cache[key] = dataAttr;
				} else if (options[key] !== undefined) {
					this.cache[key] = options[key];
				} else if (defaults[key] !== undefined) {
					this.cache[key] = defaults[key];
				}
			}

			return this.cache[key];
		};

		this.get = function(key) {
			var value = this.value(key);
			return $.isFunction(value) ? value.call(this.el, this) : value;
		};
	}
	function trapFocus(e) {
		if ('contains' in $box[0] && !$box[0].contains(e.target) && e.target !== $overlay[0]) {
			e.stopPropagation();
			$box.focus();
		}
	}
	function trigger(event) {
		// for external use
		$(document).trigger(event);
		// for internal use
		$events.triggerHandler(event);
	}
	function setSize(size, dimension) {
		//console.log('@'+Math.round((/%/.test(size) ? ((dimension === 'x' ? $window.width() : winheight()) / 100) : 1) * parseInt(size, 10)));
		return Math.round((/%/.test(size) ? ((dimension === 'x' ? $window.width() : winheight()) / 100) : 1) * parseInt(size, 10));
	}
	function setClass(str) {
		if (setClass.str !== str) {
			$box.add($overlay).removeClass(setClass.str).addClass(str);
			setClass.str = str;
		}
	}

	function getRelated(rel) {
		index = 0;
		page = 0;
		if (rel && rel !== false && rel !== 'nofollow') {
			$related = $('.' + boxElement).filter(function () {
				var options = $.data(this, colorbox);
				var settings = new Settings(this, options);
				return (settings.get('rel') === rel);
			});
			index = $related.index(settings.el);
			page = parseInt(index/8);
			// Check direct calls to Colorbox.
			if (index === -1) {
				$related = $related.add(settings.el);
				index = $related.length - 1;
			}
		} else {
			$related = $(settings.el);
		}
	}

	function launch(element) {
		var options,chtml = publicMethod.chtml,ctype;
		if (!closing) {
			options = $(element).data(upbox);
			settings = new Settings(element, options);
			getRelated(settings.get('rel'));
			ctype = settings.get('type')||$related.attr('id');
			if (!open) {
				open = active = true;
				setClass(settings.get('className'));
				$box.css({visibility:'hidden', display:'block', opacity:'',width:'',height:''});
				//$loaded = $tag(div, 'LoadedContent', 'width:0; height:0; overflow:hidden; visibility:hidden');
				$content = $tag(div, "Content").appendTo($box);
				$box.removeClass('jaQhb');
				$box.removeClass('jaChb');
				$box.removeClass('jaMhb');
				if(settings.get('title')=='hb'){
					$overlay.css({
						background: 'url(/Public/Home/image/new/tcbg.png) #000000 center center no-repeat'
					})
				}else{
					$overlay.css({
						background: '#000000'
					})
				}
				//ctype = settings.get('type')||$related.attr('id');
				if(ctype!='tips'){
					if(ctype=='jbfp'){
						$content.css({width:'924px', height:''}).html('').append(settings.get('html'));
					}else{
						$content.css({width:'', height:''}).html('').append(chtml[ctype]);
					}
					loadedWidth = $content.outerWidth(true);
					loadedHeight = $content.outerHeight(true);
					$title.html(settings.get('title')?settings.get('title'):'').show();
					/*$title.remove();
					$overlay.css({'opacity':'0','filter':'alpha(opacity=0)'});*/
					if (settings.get('closeButton')) {
						$close.html(settings.get('close')).show();
					} else {
						$close.appendTo('<div/>'); // replace with .detach() when dropping jQuery < 1.4
					}
				}else{
					$content.css({width:'140px','line-height':'20px','padding':'12px 0'}).html('').append(settings.get('html'));
					loadedWidth = $content.outerWidth(true);
					loadedHeight = $content.outerHeight(true)-44;
					$title.hide();
					$close.hide();
				}


				interfaceHeight = $box.outerHeight(true) - $box.height();
				interfaceWidth = $box.outerWidth(true) - $box.width();

				var initialWidth = setSize(settings.get('initialWidth'), 'x');
				var initialHeight = setSize(settings.get('initialHeight'), 'y');
				var maxWidth = settings.get('maxWidth');
				var maxHeight = settings.get('maxHeight');
				if(settings.get('title')=='hb'){
					loadedWidth = $content.outerWidth(true);
					loadedHeight = $content.outerHeight(true)-44;
					if(ctype=='chb'){
						$box.addClass('jaChb');
					}else if(ctype == 'qhb'||ctype=='qhbd'){
						$box.addClass('jaQhb');
					}else if(ctype == 'mhb'||ctype == 'mhbp'||ctype == 'mhbd'){
						$box.addClass('jaMhb');
					}else if(ctype == 'newqhb' || ctype == 'newqhbNo'){
						$box.addClass('jaNhb');
					}else if(ctype == 'newqhbYes'){
						$box.addClass('jaYhb');
					}

					$title.hide();
					$close.hide();
					initialWidth = 10;
					initialHeight = 10;
				}

				settings.w = Math.max((maxWidth !== false ? Math.min(initialWidth, setSize(maxWidth, 'x')) : initialWidth), 0);
				settings.h = Math.max((maxHeight !== false ? Math.min(initialHeight, setSize(maxHeight, 'y')) : initialHeight), 0);

				$box.css({width:settings.w, height:settings.h});
				var speed = settings.get('speed');
				publicMethod.position(speed);

				trigger(event_open);
				settings.get('onOpen');

				//$groupControls.add($title).hide();

				$box.focus();

				if (settings.get('trapFocus')) {
					// Confine focus to the modal
					// Uses event capturing that is not supported in IE8-
					if (document.addEventListener) {

						document.addEventListener('focus', trapFocus, true);

						$events.one(event_closed, function () {
							document.removeEventListener('focus', trapFocus, true);
						});
					}
				}

				// Return focus on closing
				if (settings.get('returnFocus')) {
					$events.one(event_closed, function () {
						$(settings.el).focus();
					});
				}
			}else{
				setClass(settings.get('className'));
			}

			var opacity = parseFloat(settings.get('opacity'));
			$overlay.css({
				opacity: opacity === opacity ? opacity : '',
				cursor: settings.get('overlayClose') ? 'pointer' : '',
				visibility: 'visible'
			}).show();
			complete = function () {
				clearTimeout(loadingTimer);
				$loadingOverlay.hide();
				trigger(event_complete);
				settings.get('onComplete');
				if(ctype=='tips'){
					setTimeout(function(){publicMethod.close()},2000)
				}
			};
			complete();
			//load(element)
		}
	}


	function appendHTML() {
		if (!$box) {
			init = false;
			$window = $(window);
			$box = $tag(div).attr({
				id: upbox,
				'class': $.support.opacity === false ? prefix + 'IE' : '', // class for optional IE8 & lower targeted CSS.
				role: 'dialog',
				tabindex: '-1'
			}).hide();
			$overlay = $tag(div, "Overlay").hide();
			$loadingOverlay = $([$tag(div, "LoadingOverlay")[0],$tag(div, "LoadingGraphic")[0]]);

			$title = $tag(div, "Title");
			$close = $('<button type="button"/>').attr({id:prefix+'Close'});

			$box.append($title,$close)
			$loadingBay = $tag(div, false, 'position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;');
		}
		if (document.body && !$box.parent().length) {
			$(document.body).append($overlay, $box.append($content, $loadingBay));
		}
	}

	function addBindings() {
		function clickHandler(e) {
			// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
			// See: http://jacklmoore.com/notes/click-events/
			if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				launch(this);
			}
		}
		if ($box) {
			if (!init) {
				init = true;
				$close.click(function () {
					if($("#jboxContent .jaAll").data('url')){
						window.location.href = $("#jboxContent .jaAll").data('url');
					}
					publicMethod.close();
				});
				$overlay.click(function () {
					if (settings.get('overlayClose')) {
						publicMethod.close();
					}
				});


				// Key Bindings
				$(document).bind('keydown.' + prefix, function (e) {
					var key = e.keyCode;
					if (open && settings.get('escKey') && key === 27) {
						e.preventDefault();
						publicMethod.close();
					}
				});
				$(document).on('click.'+prefix, '.'+boxElement, clickHandler);
			}
			return true;
		}
		return false;
	}
	// Don't do anything if Colorbox already exists.
	if ($[upbox]) {
		return;
	}
	appendHTML()
	publicMethod = $.fn[upbox] = $[upbox] = function (options, callback) {
		var settings;
		var $obj = this;
		options = options || {};
		if ($.isFunction($obj)) { // assume a call to $.colorbox
			$obj = $('<a/>');
			options.open = true;
		}
		if (!$obj[0]) { // colorbox being applied to empty collection
			return $obj;
		}
		if (addBindings()) {
			if (callback) {
				options.onComplete = callback;
			}
			$obj.each(function () {
				var old = $.data(this, upbox) || {};
				$.data(this, upbox, $.extend(old, options));
			}).addClass(boxElement);

			settings = new Settings($obj[0], options);
			if (settings.get('open')) {
				launch($obj[0]);
			}
			$obj.on('copen',function(){
				launch($obj[0]);
			})
		}
		appendHTML();

		return $obj;
	};

	publicMethod.position = function(speed, loadedCallback){
		var
		css,
		top = 0,
		left = 0,
		offset = $box.offset(),
		scrollTop,
		scrollLeft;

		$window.unbind('resize.' + prefix);


		// remove the modal so that it doesn't influence the document width/height
		$box.css({top: -9e4, left: -9e4});

		scrollTop = $window.scrollTop();
		scrollLeft = $window.scrollLeft();

		if (settings.get('fixed')) {
			offset.top -= scrollTop;
			offset.left -= scrollLeft;
			$box.css({position: 'fixed'});
		} else {
			top = scrollTop;
			left = scrollLeft;
			$box.css({position: 'absolute'});
		}
		// keeps the top and left positions within the browser's viewport.
		if (settings.get('right') !== false) {
			left += Math.max($window.width() - settings.w - setSize(settings.get('right'), 'x'), 0);
		} else if (settings.get('left') !== false) {
			left += setSize(settings.get('left'), 'x');
		} else {
			left += Math.round(Math.max($window.width() - settings.w, 0) / 2);
		}

		if (settings.get('bottom') !== false) {
			top += Math.max(winheight() - settings.h - setSize(settings.get('bottom'), 'y'), 0);
		} else if (settings.get('top') !== false) {
			top += setSize(settings.get('top'), 'y');
		} else {
			top += Math.round(Math.max(winheight() - settings.h, 0) / 2);
		}
		$box.css({visibility:'visible'});


		css = {top: top, left: left};
		//以上是box的初始宽高 和 top left;

		if (speed) {
			var tempSpeed = 0;
			$.each(css, function(i){
				if (css[i] !== previousCSS[i]) {
					tempSpeed = speed;
					return;
				}
			});
			speed = tempSpeed;
		}
		$box.css(css);

		$content.hide();
		if (!speed) {
			$box.css(css);
		}

		var ecss = {width: loadedWidth,height:loadedHeight+44};
		ecss['left'] = left+((settings.w-ecss.width)/2);
		if(settings.get('type')=='mhb'||settings.get('type') == 'mhbp'||settings.get('type') == 'mhbd'){
			ecss['left'] = ecss['left']+35;
		}
		ecss['top'] = top+((settings.h-ecss.height)/2);
		$box.dequeue().animate(ecss, {
			duration: speed || 0,
			complete: function () {

				active = false;
				$content.show();

				if (settings.get('reposition')) {
					setTimeout(function () {  // small delay before binding onresize due to an IE8 bug.
						$window.bind('resize.' + prefix, publicMethod.position);
					}, 1);
				}
				if($close.is(':visible')){
					$(document).on('mouseover','#jboxClose',function(){
						$(this).children().addClass('closeh')
					})
					$(document).on('mouseout','#jboxClose',function(){
						$(this).children().removeClass('closeh')
					})
				}
				if ($.isFunction(loadedCallback)) {
					loadedCallback();
				}

			}
		});
	}

	publicMethod.close = function (callback) {
		if (open && !closing) {
			$cut = false;
			closing = true;
			open = false;
			trigger(event_cleanup);
			settings.get('onCleanup');
			$window.unbind('.' + prefix);
			$overlay.fadeTo(settings.get('fadeOut') || 0, 0);

			$box.stop().fadeTo(settings.get('fadeOut') || 0, 0, function () {
				$box.hide();
				$overlay.hide();
				trigger(event_purge);
				$content.remove();
				setTimeout(function () {
					closing = false;
					trigger(event_closed);
					settings.get('onClosed');
					if($.isFunction(callback)){
						callback();
					}
				}, 1);
			});

		}

	};
	publicMethod.remove = function () {
		if (!$box) { return; }
		$box.stop();
		$[upbox].close();
		$box.stop(false, true).remove();
		$overlay.remove();
		closing = false;
		$box = null;
		$('.' + boxElement)
		.removeData(upbox)
		.removeClass(boxElement);

		$(document).unbind('click.'+prefix).unbind('keydown.'+prefix);
	};

	// A method for fetching the current element Colorbox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return $(settings.el);
	};
	publicMethod.settings = defaults;
	publicMethod.data = null;
	publicMethod.chtml = {
	'nfsx': '<div class="jaAll">'
	+'<p class="jaLineTo">TA想知道您的联系方式，否则无法联系到您哦！</p>'
	+'<div class="y_itip2"><span class="ys_tltip"><i class="ys_tlarr"></i>请至少填写一种联系方式</span></div>'
	+'<table cellspacing="0" class="tc_table">'
	+'<tr><td class="tc_title">手机：</td><td width="230"><input class="tc_input" name="tel" maxlength="11" type="text"/></td><td class="tc_title">QQ：</td><td><input name="qq" maxlength="11" class="tc_input" type="text"/></td></tr>'
	+'<tr><td></td><td class="tc_tips tc_tel"></td><td></td><td class="tc_tips tc_qq"></td></tr>'
	+'<tr><td class="tc_title">微信：</td><td><input class="tc_input" name="weixin" maxlength="20"  type="text"/></td><td class="tc_title">邮箱：</td><td><input name="email" class="tc_input" type="text"/></td></tr>'
	+'<tr><td></td><td class="tc_tips tc_weixin"></td><td></td><td class="tc_tips tc_email"></td></tr>'
	+'<tr><td colspan="4" class="tc_xgts"></td></tr>'
	+'</table>'
	+'<a class="btn tc_btn" href="javascript:;">确定</a>'
	+'</div>',
	'hbsc': '<div class="jaAll">'
	+'<h4 class="jaHtl center">是否确定删除该条红包记录？</h4>'
	+'<p class="jaLine center">删除后不可恢复，请谨慎操作</p>'
	+'<div class="center mtop30"><a href="javascript:;" class="jaBtn jaBtn2">取消</a><a href="#" class="jaBtn">确定</a></div>'
	+'</div>',
	'nologin':'<div class="jaAll">'
	+'<div class="jaLeft">'
	+'<div class="noldiv">'
	+'<p class="center"><font color="#999999">--------</font> 简爱 <font color="#999999">--------</font></p><p class="center">不伤害，不欺骗；</p><p class="center">简单爱，轻松约。</p>'
	+'<a href="/reg.html" class="nologinReg"></a>'
	+'</div>'
	+'</div>'
	+'<div class="jaRight">'
	+'<form name="nologin" action="/index.php?s=/Login/index" method="post">'
	+'<div class="uline"><input type="text" class="uline_input" name="account" placeholder="用户名"></div>'
	+'<div class="uline"><input type="password" class="uline_input" name="password" placeholder="密码"></div>'
	+'<a class="umore" href="/findwd.html">忘记密码？</a><div class="ucheck"><input type="checkbox" id="autologin"><label for="autologin">下次自动登录</label></div>'
	+'<a class="btn ubtn loginbtn" href="javascript:;">登录</a>'
	+'</form>'
	+'<div class="reg_href"><span>没有帐号？<a href="/reg.html">立即注册</a></span></div>'
	+'<p class="utips"></p>'
	+'</div>'
	+'</div>',
	'nostate':'<div class="jaAll">'
	+'<h4 class="jaHtl center"><i class="ys_sad"></i>抱歉，您的资料正在审核中，暂时不能使用该功能</h4>'
	+'<p class="jaLineTo mtop10">为了创造良好的交友环境，为了保证用户资料真实性，简爱网需要对新注册用户进行审核，给您带来的不便请见谅</p>'
	+'<div class="center mtop24"><a href="javascript:;" class="jaBtn ja_cBtn">我知道了</a></div>'
	+'<p class="jaLine mtop24"><font color="#999999">您可以通过以下方式联系客服加速审核：(9:00-21:00)</font></p>'
	+'<p class="jaLine mtop5"><font color="#999999"><span>1.客服热线：4000 393 633</span><span class="jaSpan">2.客服QQ：4000 393 633<a href="javascript:;" class="online"></a><span></font></p>'
	+'</div>',
	'yebz':'<div class="jaAll">'
	+'<h4 class="jaHtl center">您的账户余额不足，请去充值</h4>'
	+'<div class="center mtop24"><a href="/pay.html" class="jaBtn">充值</a></div>'
	+'</div>',
	'yeba':'<div class="jaAll">'
	+'<h4 class="jaHtl center">您还未选择开通省份，请选择开通省份</h4>'
	+'<div class="center mtop24"><a href="javascript:guanbi();" class="jaBtn">知道了</a></div>'
	+'</div>',
	'newsx':'<div class="newsx_tab"><a href="javascript:;" class="newsx_tab_a" data-type="1">免费发私信<i></i></a><a href="javascript:;" class="newsx_tab_a" style="border-left:1px solid #bababa" data-type="2">付费自定义<i></i></a></div>'
	+'<div class="jaAll" style="display:none">'
	+'<p class="newsx_mf_nr">消息内容<select></select></p>'
	+'<p class="newsx_fg_tips"><span class="newsx_fg_span">你已与TA通过私信，<a style="color:blue">点击查看</a></span></p>'
	+'<textarea disabled="disabled" class="newsx_textarea"></textarea>'
	+'<p class="newsx_num1">0/200</p>'
	+'<div class="y_itip" style="margin-top:-15px;margin-left:0;display:none"><span class="ys_tltip" style="margin:0"><i class="ys_tlarr2"></i>私信内容不能为空，请选择发送内容</span></div>'
	+'<a href="javascript:;" class="newsx_btn">发送</a>'
	+'</div>'
	+'<div class="jaAll">'
	+'<div style="text-align:center">'
	+'<img src="/Public/Home/image/new/wsj.png"/>'
	+'<p>为了展示您的诚意，第一次给TA发自定义私信需要花费10金币</p>'
	+'<a href="javascript:;" class="newsx_dyc">我同意</a>'
	+'<p style="text-align:center;border:1px #bababa dashed;padding:7px 14px;text-align:left;width:470px;margin-top:10px;display:none" class="newsx_jbbz clearfix"><span style="line-height:28px">账户余额：&nbsp;&nbsp;2金币</span><span class="y_acost" style="float:right"><i id="y_gno" class="y_gno" style="font-size:12px;color:#ff3333">您的余额不足，去充值</i><a class="btn y_gbtn" href="/pay.html" target="_blank">充值</a></span></p>'
	+'<p class="newsx_dyc_vip">成为VIP即可免费发私信哦<a href="/vip.html">成为VIP</a></p>'
	+'</div>'
	+'<div style="display:none">'
	+'<p class="newsx_mf_nr">快捷短信<select><option value="">选择快捷短信</option></select><a href="/my/kjdx.html" class="newsx_tjdx">添加快捷短信</a></p>'
	+'<p class="newsx_fg_tips"><span style="float:right">您今日还可免费给<span style="color:#10caa5" class="newsx_synum">0</span>位用户发私信</span><span class="newsx_fg_span">你已与TA通过私信，<a style="color:blue">点击查看</a></span></p>'
	+'<textarea class="newsx_textarea" placeholder="注意保护自我隐私，不要轻易给对方发送联系方式"></textarea>'
	+'<p class="newsx_num2">0/200</p>'
	+'<div class="y_itip" style="margin-top:-15px;margin-left:0;display:none"><span class="ys_tltip" style="margin:0"><i class="ys_tlarr2"></i>私信内容不能为空，说点什么吧</span></div>'
	+'<a href="javascript:;" class="newsx_btn">发送</a>'
	+'</div>'
	+'</div>',
	'goldBz':'<div class="jaAll" style="text-align:left;">'
	+'<p style="color:#999999;padding:20px 0 28px 14px;line-height:1.7;">购买服务：<b style="color:#555555;font-weight:normal;">信箱、最近访客、意中人功能服务</b><br>服务价格：<b style="color:#555555;font-weight:normal;">30元（300 金币）</b><br>使用周期：<b style="color:#555555;font-weight:normal;">1个月</b></p>'
		+'<p style="text-align:center;padding-bottom:12px;"><span style="display:inline-block;color:#ffffff;font-size:12px;line-height:28px;background:#999999;cursor:pointer;border-radius:2px;width:130px;text-align:center;">确认购买</span></p>'
	+'<p style="text-align:center;border:1px #bababa dashed;padding:7px 14px;text-align:left;width:470px;margin-top:10px;margin-bottom:24px" class="newsx_jbbz clearfix">'
	+'<span class="y_acost" style="float:right"><i id="y_gno" class="y_gno" style="font-size:12px;color:#ff3333">您的余额不足，去充值</i><a class="btn y_gbtn" href="/pay.html" target="_blank">充值</a></span></p>'
	+'</div>',
	'goldBz1':'<div class="jaAll" style="text-align:left;">'
	+'<p style="color:#999999;padding:20px 0 28px 14px;line-height:1.7;">购买服务：<b style="color:#555555;font-weight:normal;">信箱、最近访客、意中人功能服务</b><br>服务价格：<b style="color:#555555;font-weight:normal;">100元（1000 金币）</b><br>使用周期：<b style="color:#555555;font-weight:normal;">1年</b></p>'
	+'<p style="text-align:center;padding-bottom:12px;"><span style="display:inline-block;color:#ffffff;font-size:12px;line-height:28px;background:#999999;cursor:pointer;border-radius:2px;width:130px;text-align:center;">确认购买</span></p>'
	+'<p style="text-align:center;border:1px #bababa dashed;padding:7px 14px;text-align:left;width:470px;margin-top:10px;margin-bottom:24px" class="newsx_jbbz clearfix">'
	+'<span class="y_acost" style="float:right"><i id="y_gno" class="y_gno" style="font-size:12px;color:#ff3333">您的余额不足，去充值</i><a class="btn y_gbtn" href="/pay.html" target="_blank">充值</a></span></p>'
	+'</div>',
	'goldBz2':'<div class="jaAll" style="text-align:left;">'
+'<p style="color:#999999;padding:20px 0 28px 14px;line-height:1.7;">购买服务：<b style="color:#555555;font-weight:normal;">信箱、最近访客、意中人功能服务</b><br>服务价格：<b style="color:#555555;font-weight:normal;">100元（1000 金币）</b><br>使用周期：<b style="color:#555555;font-weight:normal;">1年</b></p>'
+'<p style="text-align:center;padding-bottom:12px;"><a class="ok_go" href="javascript:;" style="display:inline-block;color:#ffffff;font-size:12px;line-height:28px;background:#1fcdaa;cursor:pointer;border-radius:2px;width:130px;text-align:center;">确认购买</a></p>',
	'goldBz3':'<div class="jaAll" style="text-align:left;">'
	+'<p style="color:#999999;padding:20px 0 28px 14px;line-height:1.7;">购买服务：<b style="color:#555555;font-weight:normal;">信箱、最近访客、意中人功能服务</b><br>服务价格：<b style="color:#555555;font-weight:normal;">30元（300 金币）</b><br>使用周期：<b style="color:#555555;font-weight:normal;">1个月</b></p>'
	+'<p style="text-align:center;padding-bottom:12px;"><a class="ok_go" href="javascript:;" style="display:inline-block;color:#ffffff;font-size:12px;line-height:28px;background:#1fcdaa;cursor:pointer;border-radius:2px;width:130px;text-align:center;">确认购买</a></p>'
+'</div>',
	'goldBz4':'<div class="jaAll" style="text-align:left;">'
	+'<p style="text-align:center">抱歉，您的金币余额不足，请充值。</p>'
	+'<p style="text-align:center;border:1px #bababa dashed;padding:7px 14px;text-align:left;width:470px;margin-top:10px;margin-bottom:24px" class="newsx_jbbz clearfix">'
	+'<span class="y_acost" style="float:right"><i id="y_gno" class="y_gno" style="font-size:12px;color:#ff3333">您的余额不足，去充值</i><a class="btn y_gbtn" href="/pay.html" target="_blank">充值</a></span></p>'
	+'<p style="text-align:center;padding-bottom:12px;"><span class="jbbz_qr" style="display:inline-block;color:#ffffff;font-size:12px;line-height:28px;background:#10caa5;cursor:pointer;border-radius:2px;width:130px;text-align:center;">确认</span></p>'
	+'</div>',
	'gblxzl':'<div class="jaAll">'
	+'<h4 class="jaHtl center"><i class="ys_sad"></i>{#1}</h4>'
	+'<p style="color:gray;text-align:center" class="jaLineTo mtop10">{#2}</p>'
	+'<div class="center mtop24"><a href="javascript:;" class="jaBtn ja_cBtn {#3}">{#4}</a></div>'
	+'</div>'
	}
}(jQuery, document, window));

//个人动态展示
;(function ($, document, window) {
	var usMethod,left,top,im,iy,ih,fi,dm={},jm=[],jh=[],dh=[];
	usMethod = $.fn["uScroll"] = $["uScroll"] = function (options, callback) {
		var $obj = $(this);
		$(document).on('click',".tabs li",function(){
			var index = $(this).parent().find('li').index($(this));
			$(this).parent().find('li').removeClass('cur');
			$(this).addClass('cur');
			$(this).parent().parent().parent().find(".ja_c_box").hide().eq(index).show();
			//$('.ja_c_box').hide().eq(index).show();
			if(index==1){
				init($obj);
			}
		})
	};
	function init(obj){
		var m,tm,st,mt,g=0;
		obj.each(function(e){
			obj.eq(e).css({"bottom":($(".ja_c_abox:last").outerHeight()-26)+"px"});
			st = parseInt(obj.eq(e).offset().top);
			tm = obj.eq(e).parent().find(".c_time");
			dm[e]={};
			for(var i=0;i<tm.length;i++){
				m = tm.eq(i).text().split(".")[1];
				if(!dm[e][m]){
					mt = parseInt(tm.eq(i).offset().top)-st;
					dm[e][m]=(i+1);
					jh[g]=parseInt(tm.eq(i).offset().top);
					dh[g]=mt;
					obj.eq(e).append(jm[g] = $('<i class="icon c_month" style="top:'+mt+'px">'+m+'月</i>'));
					g++
				}
			}
		});
		fi = 0;
		left = jm[0].offset().left;
		top = jh[fi];
		$(window).scroll(function(){
			if($(window).scrollTop()>top){
				fi++
				top = jh[fi];
				jm[fi-1].css({position:'fixed',top:'0px',left:left+"px"});
			}
			if(fi>0){
				if($(window).scrollTop()<jh[fi-1]){
					fi--;
					top = jh[fi];
					jm[fi].css({position:'absolute',top:dh[fi]+'px',left:"12px"});
				}
			}
		})
	}
}(jQuery, document, window));



;(function ($, document, window) {
	var cropMethod,x,y,realwidth,realheight,realsize,cw,ch,mx,my,xx,yy,jtop,jleft,allImg,cx,iw,ih,rw,rh,ox,oy,ow,oh,
	drag = false,cdrag=false,
	$imgDiv,$big,$small,$obj,$this;

	var resize_canvas = $('<canvas></canvas>');
	var s_canvas = $('<canvas></canvas>');

	resize_canvas[0].width = 230;
	resize_canvas[0].height = 230;
	s_canvas[0].width = 120;
	s_canvas[0].height = 120;
	cropMethod = $.fn["cropImg"] = $["cropImg"] = function (options, callback) {
		cropMethod.init(this);
	};
	cropMethod.init = function(ele){
		$imgDiv = $("#imgDiv");
		$big = $("#bigtx");
		$small = $("#smalltx");
		$obj = ele;
		rw = $imgDiv.width();
		rh = $imgDiv.height();
		realsize = realwidth/rw;
		cropMethod.crop();
	}
	cropMethod.getPic = function(src){
		if(src!=""){
			$("#upbtn").html("发布");
			var img = $("<img />");
			img[0].src = src+"?"+new Date().getTime();
			img[0].onload = function(){
				realwidth = img[0].width;
				realheight = img[0].height;
				var $imgDiv = getImginfo(img[0]);
				allImg = img[0];
				$("#txxs").html($imgDiv);
				cropMethod.init($("#cdiv"));
				cropMethod.move();
				$("#txtip").hide();
			}
		}else{
			$("#txtip").html("上传的照片有出错，请重新上传").css({color:"#ff3333"})
		}
	}
	cropMethod.crop = function(){

		ox = Math.round($obj.position().left),
		oy = Math.round($obj.position().top),
		ow = parseInt($obj.outerWidth()),
		oh =  parseInt($obj.outerHeight());


		$("#clip").css({'clip':'rect('+oy+'px,'+(ox+ow)+'px,'+(oy+oh)+'px,'+ox+'px)'});//top right bottom left;
		cw = parseInt(ow*realsize);
		ch = parseInt(oh*realsize);

		x = parseInt(ox*realsize);
		y = parseInt(oy*realsize);
		cropMethod.zero = {x:x,y:y};
		cropMethod.cw = cw;
		/*try{
		resize_canvas[0].getContext('2d').drawImage($imgDiv.find('img')[0], x, y, cw, ch,0,0,230,230);
		s_canvas[0].getContext('2d').drawImage($imgDiv.find('img')[0], x, y, cw, ch,0,0,120,120);
		if($big.has('canvas').length==0){
		$big.append(resize_canvas);
		$small.append(s_canvas);
		}
		}catch(e){*/
		var bw = 230*realwidth/cw;
		var btop = y*230/cw;
		var bleft = x*230/cw;
		$big.html('<img src="'+allImg.src+'" style="position:absolute;top: -'+btop+'px;left:-'+bleft+'px" width="'+bw+'" />');
		var sw = 120*realwidth/cw;
		var sitop = y*120/cw;
		var sleft = x* 120/cw;
		$small.html('<img src="'+allImg.src+'" style="position:absolute;top: -'+sitop+'px;left:-'+sleft+'px" width="'+sw+'" />');
		//}

	}
	cropMethod.move = function(){
		$(document).on('mousedown','#cdiv',function(e){
			if(e.target.id == "gdiv"){
				drag=true;
				xx = e.clientX - $obj.position().left;
				yy = e.clientY - $obj.position().top;
			}else if(e.target.id="dragdiv"){
				cdrag = true;
				cx = e.clientX - $obj.outerWidth();
				cy = e.clientY - $obj.outerHeight();
			}
		});
		$(document).on('mousemove',function(e){
			if(drag){
				Mposition(e)
			}
			if(cdrag){
				Mresize(e);
			}
		})
		$(document).on('mouseup',function(e){
			if(drag){
				drag=false;
				Mposition(e);
				cropMethod.init($obj);
			}
			if(cdrag){
				cdrag = false;
				Mresize(e);
				cropMethod.init($obj);
			}
		})
		function Mresize(e){
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			var mw = 120;
			iw = e.clientX-cx;
			ih = e.clientY-cy;
			iw = Math.min($imgDiv.width()-$obj.position().left-2,Math.max(mw,iw));
			ih = Math.min($imgDiv.height()-$obj.position().top-2,Math.max(mw,ih));
			var cmin = Math.min(iw,ih);
			$obj.width(cmin).height(cmin)
			$("#clip").css({'clip':'rect('+oy+'px,'+(ox+cmin+2)+'px,'+(oy+cmin+2)+'px,'+ox+'px)'});
		}
		function Mposition(e){
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			gw = parseInt(e.clientX-xx);
			gh = parseInt(e.clientY-yy);
			gw = Math.round(Math.max(Math.min(gw, rw - $obj.outerWidth()), 0));
			gh = Math.round(Math.max(Math.min(gh, rh - $obj.outerHeight()), 0));
			$obj.css({'top':gh,'left':gw});
			$("#clip").css({'clip':'rect('+gh+'px,'+(gw+ow)+'px,'+(gh+oh)+'px,'+gw+'px)'});
		}
	}

	function getImginfo(obj){
		var imgDiv = $("<div id='imgDiv'></div>");
		var cDiv = $("<div id='cdiv' />");
		var dragDiv = $("<div id='dragdiv' />");
		var gDiv = $("<div id='gdiv' />");
		if(obj.width>380||obj.height>380){
			if(obj.width>obj.height){
				imgDiv.height(Math.round(obj.height*380/obj.width));
				imgDiv.width(380);
				if($(".h_container").length>0){
					cDiv.height(parseInt(imgDiv.height())-2).width(parseInt(imgDiv.height())-2);
				}else{
					cDiv.height(parseInt(imgDiv.height()-100)).width(parseInt(imgDiv.height()-100));
				}
				imgDiv.css({'margin-top':(imgDiv.width()-imgDiv.height())/2+"px"});
			}else{
				imgDiv.width(Math.round(obj.width*380/obj.height));
				imgDiv.height(380);
				if($(".h_container").length>0){
					cDiv.height(parseInt(imgDiv.width())-2).width(parseInt(imgDiv.width())-2);
				}else{
					cDiv.height(parseInt(imgDiv.width()-100)).width(parseInt(imgDiv.width()-100));
				}
				imgDiv.css({'margin-left':(380-imgDiv.width())/2+"px"});
			}
		}else{
			imgDiv.width(obj.width);
			imgDiv.height(obj.height);
			if(obj.width>obj.height){
				cDiv.height(obj.height-2).width(obj.height-2);
			}else{
				cDiv.height(obj.width-2).width(obj.width-2);
			}
			imgDiv.css({'margin-top':(380-obj.height)/2+"px"});
			imgDiv.css({'margin-left':(380-obj.width)/2+"px"});
		}
		var nobj = $(obj).clone();
		nobj[0].id = "clip";
		obj.id = "cback";
		imgDiv.append(obj);
		imgDiv.append(nobj);
		imgDiv.append(cDiv.append(dragDiv,gDiv));
		return imgDiv;
	}
}(jQuery, document, window));


;(function ($, document, window) {
	//textarea
	$.fn["textnum"] = $["textnum"] = function (options, callback) {
		var obj = $(this);
		getNuN(obj);
		obj.on('input',function(){
			getNum(obj);
		})
		var cuse = true;
		obj.on('propertychange',function(){
			if(cuse){
				cuse = false;
				getNum(obj);
				cuse = true;
			}
		})
	};
	function getNuN(obj){
		var tn = obj.attr('name');
		var le = obj.val().length;
		var maxl = parseInt(obj.data('length'));
		if(le<=maxl){
			$("#"+tn+"num").html(le+'/'+maxl);
		}else{
			obj.val(obj.val().substr(0,maxl))
			$("#"+tn+"num").html(maxl+'/'+maxl);
		}
	}
	function getNum(obj){
		var tn = obj.attr('name');
		var le = obj.val().length;
		var maxl = parseInt(obj.data('length'));
		if($("#upalert").length==1){
			le>0?$("#upalert").hide():$("#upalert").html("内容不能为空，说点什么吧").show();;
		}
		if($('#jbbox6').length==1&&obj.val()!=''&&!$('#jbbox6').prop('checked')){
			$('#jbbox6').prop('checked',true);
		}
		if(le<=maxl){
			$("#"+tn+"num").html(le+'/'+maxl);
		}else{
			obj.val(obj.val().substr(0,maxl))
			$("#"+tn+"num").html(maxl+'/'+maxl);
		}
	}
}(jQuery, document, window));

;(function($, document, window) {
	var pm,type,len,w,zurl,text;
	pm = $.fn['getPic'] = $['getPic'] = function(options,callback){
		type = options&&options.type||4;
		len = options&&options.len||3;
		w = options&&options.w||100;
		zurl = options&&options.zurl||'/index.php?s=/User/upload/type/';
		text = options&&options.text||'发布';
		$(document).on('change','.fileinput1',function(){
			$("#file .y_itip").html('');
			if(!$("#y_sub").hasClass('y_upload'))$("#y_sub").addClass('y_upload').html('正在上传');
			var url=zurl+type,_this = $(this),obj = _this.attr('id'),form = $('<form enctype="multipart/form-data" id="form1"></form>');
			var cg = (new Date()).getTime();
			if(window.FileReader){
				//html5异步提交图片;
				var length = this.files.length
				if(length==0){
					$("#y_sub").removeClass('y_upload').html(text);
				}
				if(length>len-$("#file .nofile2").length&&len!='real'){
					length=len-$("#file .nofile2").length;
					$("#file").next('.jaFtip').show().html('<i class="jaFarr"></i>上传超过了5张相片，自动选择前'+length+'张上传');
				}
				for(var i =0;i<length;i++){
					cg = (new Date()).getTime();
					var div=''
					if(len=='real'){
						div = $("<div class='nofile2' id='n"+cg+"' data-id='"+_this.attr('name')+"'><i class='nodel' style='display:none'></i><i class='process'></i><i class='filepro'></i></div>")
					}else{
						div = $("<div class='nofile2' id='n"+cg+"'><i class='nodel' style='display:none'></i><i class='process'></i><i class='filepro'></i></div>")
					}
					var span = $("<span class='nofiles2'></span>");
					div.append(span)
					$("#file").prepend(div);
					checknfile();
					var file = this.files[i];
					if(file.size>10*1024&&file.size<8*1024*1024&&file.type.indexOf('image')>-1){
						var reader = new FileReader();
						reader.id = "n"+cg;
						reader.onload = function(e){
							var img = $("<img />");
							img[0].src = e.target.result;
							img[0].style.opacity = "0.6"
							$("#"+e.target.id).find('span').append(img);
						}
						reader.readAsDataURL(file);
					}else{
						//图片出错
						if(pm.checkfileAll()){
							$("#y_sub").removeClass('y_upload').html(text);
						}
						$('#n'+cg).remove();
						checknfile();
						if($("#file .y_itip").length==1){
							$("#file .y_itip").html('<span style="font-weight: normal;font-size:12px;margin-top:0" class="ys_tltip"><i class="ys_tlarr"></i>图片大小不符合要求</span>');
						}
						//					return false;
					}

					var oReq=[];
					//var t = $("input[name='t']").val();
					var newFormData = new FormData(form[0]);
					oReq = new XMLHttpRequest();
					oReq.id = "n"+cg;
					oReq.name = file.name;
					oReq.upload.id = "n"+cg;
					oReq.upload.addEventListener("progress", uploadProgress, false);
					oReq.onreadystatechange = uploadComplete;
					oReq.open("POST", url);
					newFormData.append(_this.attr('name'), file);
					newFormData.append('from',1);
					oReq.send(newFormData);
				}

			}else{
				//iframe 异步提交图片
				var div = '';
				if(len=='real'){
					div = $("<div class='nofile2' id='n"+cg+"' data-id='"+_this.attr('name')+"'><i class='nodel' style='display:none'></i><i class='process'></i><i class='filepro'></i></div>")
				}else{
					div = $("<div class='nofile2' id='n"+cg+"'><i class='nodel' style='display:none'></i><i class='process'></i><i class='filepro'></i></div>")
				}
				var span = $("<span class='nofiles2'></span>");
				div.append(span)
				$("#file").prepend(div);
				checknfile();
				if(_this.parent().attr('id')!="form1"){
					_this.parent().append(form)
					_this.appendTo(_this.next());
				}
				var cform = _this.parent();
				if(cform.find('[name="index"]').length==0){
					cform.append("<input type='hidden' name='index' value=''/>");
					cform.append("<input type='hidden' name='from' value='2'/>");
				}
				$("#n"+cg).children('.filepro').css({width: '100%','text-align': 'center',background:'none', color: '#ffffff'}).text('图片上传中');
				try{
					var ifram = $('<iframe id="if'+cg+'" frameborder="0" style="display:none" src="about:blank" name="if'+cg+'"></iframe>');
					$("#file").append(ifram);
					$('[name="index"]').val(cg);
					cform.attr('action',url);
					cform.attr('target','if'+cg);
					cform.attr('method','post');
					cform.submit();
					//$("#n"+cg)[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = scale)";
					//$("#n"+cg)[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = this.value;
				}catch(e){
					pm.getPicid(cg,"","")
				}
			}
		});
		$(document).on('mouseover','.nofile2',function(){
			if($(this).data('id')!=''){
				$(this).find('.nodel').show();
			}
		})
		$(document).on('mouseout','.nofile2',function(){
			$(this).find('.nodel').hide();
		})
		$(document).on('click','.nodel',function(){
			var _this = $(this);
			_this.parent().remove();
			checknfile();
		})
	}
	pm.getPicid = function(index,id,src){
		if(id!=""&&src!=""){
			$("#n"+index).data("picid",id).find("span").eq(0).append("<img src='"+src+"' />");
			$("#n"+index).children('.filepro').text('上传成功');
		}else{
			$("#n"+index).remove();
		}
		if(pm.checkfileAll()){
			$("#y_sub").removeClass('y_upload').html(text);
		}
		$("#if"+index).remove();
		checknfile()
	}
	pm.checkfileAll = function(){
		var isdown = true;
		$("#file .nofile2").each(function(e){
			if(!$(this).data('picid')){
				isdown = false;
			}
		})
		return isdown;
	}
	function checknfile(){
		if(len == 'real'){
			if($("#file .nofile2[data-id='picf']").length==0){
				$("#picf").show()
			}else{
				$("#picf").hide()
			}
			if($("#file .nofile2[data-id='picz']").length==0){
				$("#picz").show()
			}else{
				$("#picz").hide()
			}
		}else{
			if($("#file .nofile2").length>=len){
				$("#file .y_add").hide();
			}else{
				$("#file .y_add").show();
			}
			if($("#file").children().length == len){
				$("#file").children().last().addClass("wr_last");
			}
			if($("#file").children().length == (len+1)){
				$("#file").eq(len-1).addClass("wr_last");
			}
			if($("#file .nofile2").length==len){
				$("#file .nofile2:last").addClass('wr_last');
			}
		}
	}
	function uploadProgress(evt){
		var id = evt.target.id;
		var process = Math.round(evt.loaded/evt.total*100);
		$("#"+id).find('.filepro').html(process+"%").css({width:process+"%"});
	}

	function uploadComplete(evt){
		if(evt.target.readyState == 4 && evt.target.status == 200){
			var dataText = evt.target.responseText
			if(dataText){
				var data = JSON.parse(dataText);

				if(data.code==200){
					$("#"+evt.target.id).data('picid',data.data.id);
					$("#"+evt.target.id).find(".filepro").html("上传成功").css({background:'none','text-align':'center',color:'#ffffff'})
					$("#"+evt.target.id).find(".process").css({'opacity':'0.7',background:'#000000'});
					$("#"+evt.target.id).find('img').attr('src',data.data.src+'?='+(new Date()).getTime()).css({width: w+'px',height: w+'px',opacity:'1'});
					$("#"+evt.target.id).find('img').attr('data-picid',data.data.id);
				}else{
					$('.photo_err').show();
					$('.photo_err').html('* 上传失败，'+data.data+'*');
					$('.photo_err').fadeOut(3000);
					$("#"+evt.target.id).remove();
					//tipsDiv.html(evt.target.name + '上传出现问题!')
				}
			}else{

				$("#"+evt.target.id).remove();
				//tipsDiv.html(evt.target.name + '上传出现问题!')
			}
			if(pm.checkfileAll()){
				$("#y_sub").removeClass('y_upload').html(text);
			}
		}
	}
}(jQuery, document, window));

