var ChemSet = function(mp, obj) {
	ChemSet.mp = this.mp = mp || Sketcher.molpad;
	this.originSet = obj.originSet || {};
	this.saveSet = obj.saveSet || {};
}
ChemSet.prototype.addSetEvent = function() {
	var context = this;

	$("#set-container label").addClass("no-select");
	$(".set-body-left ul").on("mouseover", "span", context, function(e) {
		$(e.target).css("cursor", "pointer");
	})
	$(".set-body-left ul").on("click", "span", function(e) {
		$(".set-body-left ul span").removeClass("active");
		$(e.target).addClass("active");
		var index = parseInt($(e.target).attr("data-index"));
		$(".set-item-container").css("display", "none");
		$(".set-item-container").eq(index).css("display", "block");
	});
	$("input[name='set-unit']").on("click", function(e) {
		if ($(e.target).attr('value') === 'unit-abs') {
			$('#bond-space-ratio').attr('disabled', 'disabled');
			$('#bond-space-ratio').css('border-color', 'rgb(169, 169, 169)');
			$('#bond-space-ratio ~p').text("");
			$('#bond-space-absolute').attr('disabled', false);
			$('#bond-space-absolute').trigger('blur');
		} else {
			$('#bond-space-ratio').attr('disabled', false);
			$('#bond-space-ratio').trigger('blur');
			$('#bond-space-absolute').attr('disabled', 'disabled');
			$('#bond-space-absolute').css('border-color', 'rgb(169, 169, 169)');
			$('#bond-space-absolute ~p').text("");
		}
	});
	//拖拽
	var offsetX, offsetY;
	var set_drag = false;
	$(document).on("mousedown", ".set-header", function(e) {
		if ($(e.target).closest(".set-header-close").length === 0) {
			set_drag = true;
			offsetX = e.clientX - $("#set-container").offset().left;
			offsetY = e.clientY - $("#set-container").offset().top;
		}
	})
	$(document).on("mousemove", function(e) {
		$('.set-header').css('cursor', 'move');
		var containerWidth = $("#set-container").width();
		var containerHeight = $("#set-container").height();
		if (set_drag && offsetX !== undefined && offsetY !== undefined) {
			//防止拖拽超出界限
			if (e.clientX - offsetX < 0) {
				var newX = 0 + 'px';
			} else if (e.clientX - offsetX + containerWidth > $(document).width()) {
				var newX = $(document).width() - containerWidth + 'px';
			} else {
				var newX = (e.clientX - offsetX) + 'px';
			}
			if (e.clientY - offsetY < 0) {
				var newY = 0 + 'px';
			} else if (e.clientY - offsetY + containerHeight > $(document).height()) {
				var newY = $(document).height() - containerHeight + 'px';
			} else {
				var newY = (e.clientY - offsetY) + 'px';
			}
			$('#set-container').css('left', newX).css('top', newY);
		}
	})
	$(document).on('mouseup', function(e) {
		set_drag && (set_drag = false);
	});

	$(".set-container-shade").on("click", function(e) {
		if ($(e.target).closest("#set-container").length === 0) {
			$(this).fadeOut('800');
		}
	});

	$(".set-container-shade").keypress(function(e) {
		e.stopPropagation();
	})

	$(".set-header-close").on("mousedown", function(e) {
		$("#set-container").fadeOut('1500', function() {
			$('.set-container-shade').fadeOut('800');
		});
	});
	//记录初始单位
	var dpi = this.constructor.getDPI()[0];
	$('#set-bond-unit').data('lastValue', $('#set-bond-unit').val());
	$('#set-arrow-unit').data('lastValue', $('#set-arrow-unit').val());
	$('#set-flowDiagram-unit').data('lastValue', $('#set-flowDiagram-unit').val());
	$('#set-bond-unit, #set-arrow-unit, #set-flowDiagram-unit').on("change", function(e) {
		var beforeUnit = $(this).data('lastValue');
		$(this).data('lastValue', $(this).val());
		var afterUnit = $(this).val();
		//改变单位后，自动更新所有输入框中的值
		var multiValue = 1;
		//计算multiValue。ls提取出来。20180418
		multiValue = ChemSet.calPxRate(beforeUnit, afterUnit);

		if ($(this).attr('id') === "set-bond-unit") {
			ChemSet.setHtml_bond(multiValue);
		} else if ($(this).attr('id') === "set-arrow-unit") {
			ChemSet.setHtml_arrow(multiValue);
		} else if ($(this).attr('id') === "set-flowDiagram-unit") {
			ChemSet.setHtml_flowDiagram(multiValue);
		}
		//改变单位后需要重新进行数值验证
		$('#set-container input[type="text"]').trigger('blur');
	});

	var context = this;
	$("#set-button-confirm").on("click", context, function(e) {
		if (!context.constructor.setIsRight()) {
            $('.set-confirm-status').text(window.langEn?'parameter error':'参数错误！');
			return;
		}



		/**
		var settingObj_px = {
			angle: 150,//单位为度
			space_absolute: 4.8,//对应于delta中的[-2.4, 2.4],//double bond
			space_relative: 0.12,//40 * 0.12 = 4.8
			gen_bond_len: 40, //对应于length: 40,//化学键长度
			bold_bond_width: 5.32,//对应于delta中的[-2.66,2.66],//BoldBond
			gen_bond_width: 1.33, //对应于化学键的width: 1.33,
			margin_width: 2.68, //对应于原子radius: 6, 编辑器中的6大致等于2.68。 如果设置的值（单位为像素）大于2.68，则在6的基础上进行设置
			hash_width: 3.59,//对应于[-3.59, 3.59], //wedge/hash bond（这里是wedge和hash化学键的宽度）
			arrow_line_width: 6
		};
		**/
		$("#set-container").fadeOut('1500', function() {
			$(".set-container-shade").fadeOut('800');
			try {
				//化学键
				var angle = parseFloat($('.set-bond-container input[id="bond-angle"]').val());
				var value_type = $('.set-bond-container input[name="set-unit"]:checked').val();
				var space_absolute = undefined,
					space_relative = undefined;
				if (value_type === 'unit-rel') {
					space_relative = parseFloat($('#bond-space-ratio').val()) / 100;
				} else {
					space_absolute = parseFloat($('#bond-space-absolute').val());
				}
				var gen_bond_len = parseFloat($("#set_gen_bond_len").val());
				var bold_bond_width = parseFloat($('#set_bold_bond_width').val());
				var gen_bond_width = parseFloat($('#set_gen_bond_width').val());
				var margin_width = parseFloat($('#set_margin_width').val());
				var hash_width = parseFloat($('#set_hash_width').val());

				//反应箭头
				var arrow_line_width = parseFloat($('#set-arrow-line-width').val()); //线条宽度
				var arrow_head_width = parseFloat($('#set-arrow-head-width').val()); //箭头头部宽度
				var arrow_len = parseFloat($('#set-arrow-length').val()); //箭头默认长度

				//流程图
				var flowDiagram_line_width = parseFloat($('#set-flowDiagram-line-width').val());
				var flowDiagram_len = parseFloat($('#set-flowDiagram-length').val());
				var flowDiagram_width = parseFloat($('#set-flowDiagram-width').val());

				//报错显示
				var show = false;
				var hidden = false;
				var display_value = $('.set-error-container input[name="set-error"]:checked').val();
				if (display_value === 'show') show = true;
				if (display_value === 'hidden') hidden = true;

				var settingObj = {
					//化学键相关设置
					angle: angle, //单位为度
					space_absolute: space_absolute, //对应于delta中的[-2.4, 2.4],//double bond
					space_relative: space_relative, //40 * 0.12 = 4.8
					gen_bond_len: gen_bond_len, //对应于length: 40,//化学键长度
					bold_bond_width: bold_bond_width, //对应于delta中的[-2.66,2.66],//BoldBond
					gen_bond_width: gen_bond_width, //对应于化学键的width: 1.33,
					margin_width: margin_width, //对应于原子radius: 6, 编辑器中的6大致等于2.68。 如果设置的值（单位为像素）大于2.68，则在6的基础上进行设置
					hash_width: hash_width, //对应于[-3.59, 3.59], //wedge/hash bond（这里是wedge和hash化学键的宽度）
					//箭头相关设置
					arrow_line: arrow_line_width,
					arrow_width: arrow_head_width,
					arrow_len: arrow_len,
					//流程图设置：
					flowDiagram_line: flowDiagram_line_width,
					flowDiagram_len: flowDiagram_len,
					flowDiagram_width: flowDiagram_width,

					//报错显示
					error_show: show,
					error_hidden: hidden,
				};
				var unit_type_bond = $('#set-bond-unit').val(),
					unit_type_arrow = $('#set-arrow-unit').val(),
					unit_type_flowDiagram = $('#set-flowDiagram-unit').val();
				var unit_multi_bond = 1,
					unit_multi_arrow = 1,
					unit_multi_flowDiagram = 1;

				//设置好后要统一乘以这个scaleRate。ls 20180416
				var scaleRate = $("#zoomIn-container").attr('data-float') || 1;

				//像素转化比例计算　ls提取　20180416				
				unit_multi_bond = ChemSet.calPxRate(unit_type_bond);
				unit_multi_arrow = ChemSet.calPxRate(unit_type_arrow);
				unit_multi_flowDiagram = ChemSet.calPxRate(unit_type_flowDiagram);

				if (settingObj.space_absolute !== undefined) {
					settingObj.space_absolute = settingObj.space_absolute * unit_multi_bond * scaleRate;
				}
				settingObj.gen_bond_len = settingObj.gen_bond_len * unit_multi_bond * scaleRate;
				settingObj.bold_bond_width = settingObj.bold_bond_width * unit_multi_bond * scaleRate;
				settingObj.gen_bond_width = settingObj.gen_bond_width * unit_multi_bond * scaleRate;
				settingObj.margin_width = settingObj.margin_width * unit_multi_bond;
				settingObj.hash_width = settingObj.hash_width * unit_multi_bond * scaleRate;

				settingObj.arrow_line = settingObj.arrow_line * unit_multi_arrow;
				settingObj.arrow_width = settingObj.arrow_width * unit_multi_arrow * scaleRate;
				settingObj.arrow_len = settingObj.arrow_len * unit_multi_arrow * scaleRate;

				settingObj.flowDiagram_line = settingObj.flowDiagram_line * unit_multi_flowDiagram;
				settingObj.flowDiagram_width = settingObj.flowDiagram_width * unit_multi_flowDiagram;
				settingObj.flowDiagram_len = settingObj.flowDiagram_len * unit_multi_flowDiagram;

				//取消acs状态
				if (window.acs) {
					window.acs.disabled();
				}

				//dealObj 是否作用于之前有的。
				var setFn = function(dealObj) {
					try {
						// debugger;
						//如果存在分子，则对选中分子进行设置
						if (dealObj) {
							context.mp.selectAll();
							var partialBondSetting = {
								bondWidth: settingObj.gen_bond_width,
								bondLength: settingObj.gen_bond_len,
							};
							context.mp.mol.setBondProp(partialBondSetting);
							context.mp.sel.clear();
							context.mp.draw();

						}

						//如果不存在分子，则对整体画布进行设置
						context.setBond(settingObj);

						context.setArrow(settingObj);
						context.setFlowdiagram(settingObj);
						context.setError(settingObj);
					} catch (e) {
						console.log(e.message);
					}
				}


				if (context.mp.mol.isEmpty()) {
					setFn(false);
				} else {
					var popOptions = {
						toInsertInfo: window.langEn ? "Whether the new settings apply to the drawn part ? ":"是否作用于已绘制部分？", // modified by hkk 2019/10/25
						callback_no: function() {
							setFn(false);
						},
						callback_yes: function() {
							setFn(true);
						}
					};
					$(this).showAlert(popOptions);
				}



			} catch (err) {
				console.log(err.message);
			}
		})
	});
	$("#set-button-confirm").on("blur", function() {
		$('.set-confirm-status').text("");
	});
	$("#set-button-cancel").on("click", context, function(e) {
		context.resetSetting();
	});
	$("#set_gen_bond_len").on('blur', function(event) {
		if ($('[name=set-unit]:checked').val() == 'unit-rel') {
			var rate = $("#bond-space-ratio").val();
			var bondLen = $('#set_gen_bond_len').val();
			if (!isNaN(rate) && !isNaN(bondLen)) {
				$("#bond-space-absolute").val((rate * bondLen / 100).toFixed(3));
			}
		}
		var that = this;
		// setTimeout(function() {
		var value = ($(that).val()).trim();
		var id = $(that).attr('id');
		ChemSet.validateSet(value, id);
		// })
	});
	$('#set-container input[type="text"]').on("blur", function(e) {
		//bond-angle, bond-space-ratio, bond-space-absolute, set_gen_bond_len, set_bold_bond_width, set_gen_bond_width
		//set_margin_width, set_hash_width

		//set-arrow-line-width, set-arrow-length, set-arrow-head-width

		//set-flowDiagram-line-width, set-flowDiagram-length, set-flowDiagram-width
		var value = ($(this).val()).trim();
		var id = $(this).attr('id');
		ChemSet.validateSet(value, id);
	});


}

//对用户输入的数据进行验证
ChemSet.validateSet = function(value, id) {

	//ls20180529 这个单位以pt来初始化。
	//再转换成px.因为px与pt在不同屏幕的情况下转换出来不一致。
	var ptRules = {
		//单位为cm
		"bond-angle": [0, 360],
		"bond-space-ratio": [1, 100],   // modified by hkk 2018.8.24 [8,100]--[1,100]
		"bond-space-absolute": [1, 100], //需要根据与化学键长度的比例进行判断 modified by hkk 2018.8.24 [8,100]--[1,100]
		"set_gen_bond_len": [4, 720], //键长4到720pt　line-width
		"set_bold_bond_width": [1, 10], //需要根据与普通化学键的宽度的比例进行判断 line-width的1到10倍。　chemdraw是>=line-width小于72.
		"set_gen_bond_width": [0, 72], //键粗0到72pt之间。
		"set_margin_width": [1, 35], //需要根据与化学键的键长的比例进行判断　???
		"set_hash_width": [1, 20], //需要根据与化学键键长的比例进行判断 ???

		"set-arrow-line-width": [0.2, 5], //默认为1.33px
		"set-arrow-length": [5, 140], //默认为80px
		"set-arrow-head-width": [1, 10], //默认为6px

		"set-flowDiagram-line-width": [0.2, 5],
		"set-flowDiagram-length": [20, 160], //默认为80px
		"set-flowDiagram-width": [10, 80], //默认为40px
	}

	var rules = {};
	//pt的还是转为px的。这样可以不修改其他地方的逻辑。
	(function() {
		var changeArr = ['set_gen_bond_len',
			'set_gen_bond_width', "set-arrow-line-width",
			"set-arrow-length",
			"set-arrow-head-width",
			"set-flowDiagram-line-width",
			"set-flowDiagram-length",
			"set-flowDiagram-width"
		];
		var rate = ChemSet.calPxRate('pt', 'px');
		for (var i in ptRules) {
			if (!ptRules.hasOwnProperty(i)) {
				continue;
			}
			if (changeArr.indexOf(i) > -1) {
				rules[i] = ptRules[i].map(function(v) {
					return v * rate;
				})
			} else {
				rules[i] = ptRules[i];
			}
		}

	})();

	// var rules = {
	// 	//单位为像素
	// 	"bond-angle": [0, 360],
	// 	"bond-space-ratio": [8, 100],
	// 	"bond-space-absolute": [8, 100],//需要根据与化学键长度的比例进行判断
	// 	"set_gen_bond_len": [10, 72],
	// 	"set_bold_bond_width": [1, 10],//需要根据与普通化学键的宽度的比例进行判断
	// 	"set_gen_bond_width": [1, 5],
	// 	"set_margin_width": [1, 35],//需要根据与化学键的键长的比例进行判断
	// 	"set_hash_width": [1, 20], //需要根据与化学键键长的比例进行判断

	// 	"set-arrow-line-width": [1, 5],//默认为1.33
	// 	"set-arrow-length": [20, 140],//默认为80
	// 	"set-arrow-head-width": [2, 10],//默认为6

	// 	"set-flowDiagram-line-width": [1, 5],
	// 	"set-flowDiagram-length": [40, 120],//默认为80
	// 	"set-flowDiagram-width": [20, 60],//默认为40
	// }


	var isRight = true; //标识是否存在参数错误
	var toShow = "";
	var dpi = ChemSet.getDPI()[0];
	var unit_type_bond = $('#set-bond-unit').val(),
		unit_type_arrow = $('#set-arrow-unit').val(),
		unit_type_flowDiagram = $('#set-flowDiagram-unit').val();
	var selector = "#" + id;
	var spanSelector = selector + " ~ p";
	//验证是否为数字
	if (isNaN(value) || value.length === 0) {
		isRight = false;
        //toShow = "请输入数字！";
		toShow = window.langEn ?'Please enter a number':'请输入数字';
		$(selector).css('border-color', 'rgb(255, 120, 120)');
		$(spanSelector).text(toShow);
		$(spanSelector).css('display', 'block');
	} else if (id === 'bond-space-absolute' || id === 'set_margin_width' || id === 'set_hash_width') {
		var bondLen = $('#set_gen_bond_len').val();
		var ratio = undefined;
		var isNowRight = true; //只标识当前input值是否正常
		if (!isNaN(bondLen)) {
			bondLen = parseFloat(bondLen);
			ratio = parseFloat(value) / bondLen * 100;
			if (ratio < rules[id][0] || ratio > rules[id][1]) {
				isRight = false;
				isNowRight = false
                //toShow = "数值应该在固定键长的" + rules[id][0] + "%和" + rules[id][1] + "%之间";
				toShow = window.langEn? "The fixed bonds should be between " + rules[id][0] + "% and " + rules[id][1]+"%":"数值应该在固定键长的" + rules[id][0] + "%和" + rules[id][1] + "%之间";
				$(selector).css('border-color', 'rgb(255, 120, 120)');
				$(spanSelector).text(toShow);
				$(spanSelector).css('display', 'block');
			}
		} else {
			isRight = false;
            toShow = window.langEn?"The bond length should be a number": "固定键长应该为数字";
			var otherSelector = "#" + "set_gen_bond_len";
			var otherSpanSelector = otherSelector + " ~ p";
			$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
			$(otherSpanSelector).text(toShow);
			$(otherSpanSelector).css('display', 'block');
			$("#set-container").data(otherSelector.split('#')[1],false);
		}
		//如果没有错误则，取消红色边框
		if (isNowRight) {
			$(selector).css('border-color', 'rgb(169, 169, 169)');
			$(spanSelector).text("");
		}
	} else if (id === 'set_bold_bond_width') {
		var bondWidth = $('#set_gen_bond_width').val();
		var ratio = undefined;
		var isNowRight = true; //只标识当前input值是否正常
		if (!isNaN(bondWidth)) {
			bondWidth = parseFloat(bondWidth);
			var ratio = parseFloat(value) / bondWidth;
			if (ratio < rules[id][0] || ratio > rules[id][1]) {
				isRight = false;
				isNowRight = false;
                toShow = window.langEn ?'Values should be between '+rules[id][0]+' and '+rules[id][1]+' times the width of the line' :"数值应该在线条宽度的" + rules[id][0] + "倍和" + rules[id][1] + "倍之间";
				$(selector).css('border-color', 'rgb(255, 120, 120)');
				$(spanSelector).text(toShow);
				$(spanSelector).css('display', 'block');
			}
		} else {
			isRight = false;
            toShow =window.langEn ? "Please enter a number": "请输入数字！";
			var otherSelector = '#set_gen_bond_width';
			var otherSpanSelector = otherSelector + " ~ p";
			$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
			$(otherSpanSelector).text(toShow);
			$(otherSpanSelector).css('display', 'block');
			$("#set-container").data(otherSelector.split('#')[1],false);
		}
		//如果没有错误则，取消红色边框
		if (isNowRight) {
			$(selector).css('border-color', 'rgb(169, 169, 169)');
			$(spanSelector).text("");
		}
	} else if (id === 'set_gen_bond_len') {

		var minValue, maxValue;
		var isNowRight = true; //只标识当前input值是否正常

		//px To ... ls20180418
		var unit_multi_bond = ChemSet.calPxRate('px', unit_type_bond);
		minValue = (rules[id][0] * unit_multi_bond).toFixed(3);
		maxValue = (rules[id][1] * unit_multi_bond).toFixed(3);

		if (parseFloat(value) < minValue || parseFloat(value) > maxValue) {
			isRight = false;
			isNowRight = false;
            //toShow = "固定键长应该在" + minValue + unit_type_bond + "和" + maxValue + unit_type_bond + "之间！";
			toShow = window.langEn? "The fixed bonds should be between " + minValue + unit_type_bond + " and " + maxValue + unit_type_bond:"固定键长应该在" + minValue + unit_type_bond + "和" + maxValue + unit_type_bond + "之间！";
			$(selector).css('border-color', 'rgb(255, 120, 120)');
			$(spanSelector).text(toShow);
			$(spanSelector).css('display', 'block');

		}
		//如果没有错误则，取消红色边框
		if (isNowRight) {
			$(selector).css('border-color', 'rgb(169, 169, 169)');
			$(spanSelector).text("");
		}
		//设置化学键键长的同时，需要验证其他属性值
		var bondSpace = $('#bond-space-absolute').val();
		if (isNaN(bondSpace)) {
			isRight = false;
            toShow = window.langEn ?'Please enter a number':'请输入数字';
			var otherSelector = '#bond-space-absolute'
			var otherSpanSelector = otherSelector + " ~ p";
			$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
			$(otherSpanSelector).text(toShow);
			$(otherSpanSelector).css('display', 'block');
			$("#set-container").data(otherSelector.split('#')[1],false);
		} else {
			var ratio = parseFloat(bondSpace) / parseFloat(value) * 100;
			var otherSelector = '#bond-space-absolute';
			var otherSpanSelector = otherSelector + " ~ p";
			if (ratio < rules['bond-space-absolute'][0] || ratio > rules['bond-space-absolute'][1]) {
				isRight = false;
                //toShow = "数值应该在固定键长的" + rules['bond-space-absolute'][0] + "%和" + rules['bond-space-absolute'][1] + "%之间";
				toShow = window.langEn ? 'The value should be between '+rules[id][0]+'% and '+rules[id][1]+'%':"数值应该在固定键长的" + rules['bond-space-absolute'][0] + "%和" + rules['bond-space-absolute'][1] + "%之间";
				$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
				$(otherSpanSelector).text(toShow);
				$(otherSpanSelector).css('display', 'block');
				$("#set-container").data(otherSelector.split('#')[1],false);
			} else {
				$(otherSelector).css('border-color', 'rgb(169, 169, 169)');
				$(otherSpanSelector).text("");
				$("#set-container").data(otherSelector.split('#')[1],true);
			}
		}
		var bondMarginWidth = $('#set_margin_width').val();
		if (isNaN(bondMarginWidth)) {
			isRight = false;
            toShow = window.langEn ?'Please enter a number':'请输入数字';
			var otherSelector = '#set_margin_width'
			var otherSpanSelector = otherSelector + " ~ p";
			$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
			$(otherSpanSelector).text(toShow);
			$(otherSpanSelector).css('display', 'block');
			$("#set-container").data(otherSelector.split('#')[1],false);
		} else {
			var ratio = parseFloat(bondMarginWidth) / parseFloat(value) * 100;
			var otherSelector = '#set_margin_width';
			var otherSpanSelector = otherSelector + " ~ p";
			if (ratio < rules['set_margin_width'][0] || ratio > rules['set_margin_width'][1]) {
				isRight = false;
                //toShow = "数值应该在固定键长的" + rules['set_margin_width'][0] + "%和" + rules['set_margin_width'][1] + "%之间";
				toShow = window.langEn ?"The fixed bonds should be between " + rules['set_margin_width'][0] + "% and " + rules['set_margin_width'][1] + "%":"数值应该在固定键长的" + rules['set_margin_width'][0] + "%和" + rules['set_margin_width'][1] + "%之间";
				$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
				$(otherSpanSelector).text(toShow);
				$(otherSpanSelector).css('display', 'block');
				$("#set-container").data(otherSelector.split('#')[1],false);
			} else {
				$(otherSelector).css('border-color', 'rgb(169, 169, 169)');
				$(otherSpanSelector).text("");
				$("#set-container").data(otherSelector.split('#')[1],true);
			}
		}
		var bondHash = $('#set_hash_width').val();
		if (isNaN(bondHash)) {
			isRight = false;
            toShow = window.langEn ?'Please enter a number':'请输入数字';
			var otherSelector = '#set_hash_width'
			var otherSpanSelector = otherSelector + " ~ p";
			$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
			$(otherSpanSelector).text(toShow);
			$(otherSpanSelector).css('display', 'block');
			$("#set-container").data(otherSelector.split('#')[1],false);
		} else {
			var ratio = parseFloat(bondHash) / parseFloat(value) * 100;
			var otherSelector = '#set_hash_width';
			var otherSpanSelector = otherSelector + " ~ p";
			if (ratio < rules['set_hash_width'][0] || ratio > rules['set_hash_width'][1]) {
				isRight = false;
                //toShow = "数值应该在固定键长的" + rules['set_hash_width'][0] + "%和" + rules['set_hash_width'][1] + "%之间";
				toShow = window.langEn? "The fixed bonds should be between " + rules['set_hash_width'][0] + " and " + rules['set_hash_width'][1]:"数值应该在固定键长的" + rules[id][0] + "%和" + rules[id][1] + "%之间";
				$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
				$(otherSpanSelector).text(toShow);
				$(otherSpanSelector).css('display', 'block');
				$("#set-container").data(otherSelector.split('#')[1],false);
			} else {
				$(otherSelector).css('border-color', 'rgb(169, 169, 169)');
				$(otherSpanSelector).text("");
				$("#set-container").data(otherSelector.split('#')[1],true);
			}
		}
	} else if (id === "set_gen_bond_width") {
		var minValue, maxValue;
		var isNowRight = true;

		//px To ... ls20180418
		var unit_multi_bond = ChemSet.calPxRate('px', unit_type_bond);
		minValue = (rules[id][0] * unit_multi_bond).toFixed(3);
		maxValue = (rules[id][1] * unit_multi_bond).toFixed(3);

		if (parseFloat(value) < minValue || parseFloat(value) > maxValue) {
			isRight = false;
			isNowRight = false;
            //toShow = "线条宽度应该在" + minValue + unit_type_bond + "和" + maxValue + unit_type_bond + "之间！";
			toShow = window.langEn ?"The value should be between " + minValue + unit_type_bond + " and " + maxValue + unit_type_bond + " of the line width" :"线条宽度应该在" + minValue + unit_type_bond + "和" + maxValue + unit_type_bond + "之间！";
			var selector = "#" + id;
			var spanSelector = selector + " ~ p";
			$(selector).css('border-color', 'rgb(255, 120, 120)');
			$(spanSelector).text(toShow);
			$(spanSelector).css('display', 'block');

		}
		//如果没有错误则，取消红色边框
		if (isNowRight) {
			$(selector).css('border-color', 'rgb(169, 169, 169)');
			$(spanSelector).text("");
		}
		//设置普通化学键宽度时需要验证粗体化学键长度
		var boldWidth = $('#set_bold_bond_width').val();
		if (isNaN(boldWidth)) {
			isRight = false;
            toShow = window.langEn ?'Please enter a number':'请输入数字';
			var otherSelector = '#set_bold_bond_width';
			var otherSpanSelector = otherSelector + " ~ p";
			$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
			$(otherSpanSelector).text(toShow);
			$(otherSpanSelector).css('display', 'block');
			$("#set-container").data(otherSelector.split('#')[1],false);
		} else {
			var ratio = parseFloat(boldWidth) / parseFloat(bondWidth);
			var otherSelector = '#set_bold_bond_width';
			var otherSpanSelector = otherSelector + " ~ p";
			if (ratio < rules[id][0] || ratio > rules[id][1]) {
				isRight = false;
                //toShow = "数值应该在线条宽度的" + rules[id][0] + "%和" + rules[id][1] + "%之间";
				toShow = window.langEn ?"The value should be between " + rules[id][0] + "% and " + rules[id][1] + "% of the line width" :"数值应该在线条宽度的" + rules[id][0] + "%和" + rules[id][1] + "%之间";
				$(otherSelector).css('border-color', 'rgb(255, 120, 120)');
				$(otherSpanSelector).text(toShow);
				$(otherSpanSelector).css('display', 'block');
				$("#set-container").data(otherSelector.split('#')[1],false);
			} else {
				$(otherSelector).css('border-color', 'rgb(169, 169, 169)');
				$(otherSpanSelector).text("");
				$("#set-container").data(otherSelector.split('#')[1],true);
			}
		}
	} else if (id === 'bond-angle' || id === 'bond-space-ratio') {
		//化学键键角和相对键间距需要单独处理
		var isNowRight = true;
		if (parseFloat(value) < rules[id][0] || parseFloat(value) > rules[id][1]) {
			isRight = false;
			isNowRight = false;
			var toShow = undefined;
			if (id === 'bond-angle') {
                //toShow = "数值应该在" + rules[id][0] + "度和" + rules[id][1] + "度之间！";
				toShow = window.langEn? "The value should be between " + rules[id][0] + "° and " + rules[id][1] + "° of the line width":"数值应该在" + rules[id][0] + "度和" + rules[id][1] + "度之间！";
			} else {
                //toShow = "数值应该在" + rules[id][0] + "%和" + rules[id][1] + "%之间！";
				toShow = window.langEn? "The value should be between " + rules[id][0] + "% and " + rules[id][1] + "% of the line width":"数值应该在" + rules[id][0] + "度和" + rules[id][1] + "度之间！";
			}
			var selector = "#" + id;
			var spanSelector = selector + " ~ p";
			//TODO：最好不直接通过id来设置颜色，这样会把class的颜色覆盖
			$(selector).css('border-color', 'rgb(255, 120, 120)');
			$(spanSelector).text(toShow);
			$(spanSelector).css('display', 'block');
		}
		//如果没有错误则，取消红色边框
		if (isNowRight) {
			$(selector).css('border-color', 'rgb(169, 169, 169)');
			$(spanSelector).text("");
		}

	} else if (id.indexOf('arrow') === -1 && id.indexOf('flowDiagram') === -1) {
		//处理没有关联关系的化学键信息
		var minValue, maxValue;
		var isNowRight = true;

		//px To ... ls20180418
		var unit_multi_bond = ChemSet.calPxRate('px', unit_type_bond);
		minValue = (rules[id][0] * unit_multi_bond).toFixed(3);
		maxValue = (rules[id][1] * unit_multi_bond).toFixed(3);

		if (parseFloat(value) < minValue || parseFloat(value) > maxValue) {
			isRight = false;
			isNowRight = false;
            //toShow = "数值应该在" + minValue + unit_type_bond + "和" + maxValue + "之间！";
			toShow = window.langEn? "The value should be between " + minValue + unit_type_bond + " and " + maxValue + unit_type_bond +  " of the line width":"数值应该在" + minValue + unit_type_bond + "和" + maxValue + "之间！";
			var selector = "#" + id;
			var spanSelector = selector + " ~ p";
			$(selector).css('border-color', 'rgb(255, 120, 120)');
			$(spanSelector).text(toShow);
			$(spanSelector).css('display', 'block');
		}
		//如果没有错误则，取消红色边框
		if (isNowRight) {
			$(selector).css('border-color', 'rgb(169, 169, 169)');
			$(spanSelector).text("");
		}
	} else if (id.indexOf('arrow') !== -1) {
		var minValue, maxValue;
		var isNowRight = true;

		//px To ... ls20180418
		var unit_multi_bond = ChemSet.calPxRate('px', unit_type_arrow);
		minValue = (rules[id][0] * unit_multi_bond).toFixed(3);
		maxValue = (rules[id][1] * unit_multi_bond).toFixed(3);

		if (parseFloat(value) < minValue || parseFloat(value) > maxValue) {
			isRight = false;
			isNowRight = false;
            toShow = "数值应该在" + minValue + unit_type_arrow + "和" + maxValue + unit_type_arrow + "之间！";
			toShow = window.langEn? "The value should be between " + minValue + unit_type_arrow + " and " + maxValue + unit_type_arrow +  " of the line width":"数值应该在" + minValue + unit_type_arrow + "和" + maxValue + unit_type_arrow + "之间！";
			var selector = "#" + id;
			var spanSelector = selector + " ~ p";
			$(selector).css('border-color', 'rgb(255, 120, 120)');
			$(spanSelector).text(toShow);
			$(spanSelector).css('display', 'block');
		}
		//如果没有错误则，取消红色边框
		if (isNowRight) {
			$(selector).css('border-color', 'rgb(169, 169, 169)');
			$(spanSelector).text("");
		}
	} else if (id.indexOf('flowDiagram') !== -1) {
		var minValue, maxValue;
		var isNowRight = true;

		//px To ... ls20180418
		var unit_multi_bond = ChemSet.calPxRate('px', unit_type_flowDiagram);
		minValue = (rules[id][0] * unit_multi_bond).toFixed(3);
		maxValue = (rules[id][1] * unit_multi_bond).toFixed(3);

		if (parseFloat(value) < minValue || parseFloat(value) > maxValue) {
			isRight = false;
			isNowRight = false;
            //toShow = "数值应该在" + minValue + unit_type_flowDiagram + "和" + maxValue + unit_type_flowDiagram + "之间！";
			toShow = window.langEn? "The value should be between " + minValue + unit_type_flowDiagram + " and " + maxValue + unit_type_flowDiagram +  " of the line width":"数值应该在" + minValue + unit_type_flowDiagram + "和" + maxValue + unit_type_flowDiagram + "之间！";
			var selector = "#" + id;
			var spanSelector = selector + " ~ p";
			$(selector).css('border-color', 'rgb(255, 120, 120)');
			$(spanSelector).text(toShow);
			$(spanSelector).css('display', 'block');
		}
		//如果没有错误则，取消红色边框
		if (isNowRight) {
			$(selector).css('border-color', 'rgb(169, 169, 169)');
			$(spanSelector).text("");
		}
	}

	$("#set-container").data(id, isRight);
}

ChemSet.setIsRight = function() {
	var ids = [
		"bond-angle",
		"bond-space-ratio",
		"bond-space-absolute",
		"set_gen_bond_len",
		"set_bold_bond_width",
		"set_gen_bond_width",
		"set_margin_width",
		"set_hash_width",

		"set-arrow-line-width",
		"set-arrow-length",
		"set-arrow-head-width",

		"set-flowDiagram-line-width",
		"set-flowDiagram-length",
		"set-flowDiagram-width",
	];
	var isRight = true;
	for (var i = 0; i < ids.length; i++) {
		if ($("input[value = 'unit-rel']").attr('checked')) {
			ids.splice(2, 1);
		} else {
			ids.splice(1, 1);
		}
		if ($("#set-container").data(ids[i]) === false) {
			isRight = false;
			break;
		}
	}
	return isRight;
}

ChemSet.resetRight = function() {
	var ids = [
		"bond-angle",
		"bond-space-ratio",
		"bond-space-absolute",
		"set_gen_bond_len",
		"set_bold_bond_width",
		"set_gen_bond_width",
		"set_margin_width",
		"set_hash_width",

		"set-arrow-line-width",
		"set-arrow-length",
		"set-arrow-head-width",

		"set-flowDiagram-line-width",
		"set-flowDiagram-length",
		"set-flowDiagram-width",
	];
	for (var i = 0; i < ids.length; i++) {
		$("#set-container").data(ids[i], true);
	}
}

//像素转化比例。ls20180416抽离。
//统一起来，计算的时候方便。
//单位换算的系数计算。默认为转化成px需要乘的系数
ChemSet.calPxRate = function(from, to) {
	to = to || 'px';
	var context = this;
	var dpi = context.getDPI()[0];


	//devicePixelRatio的处理。
	var dpr = this.mp.devicePixelRatio;
	if ("ActiveXObject" in window && 1 == this.mp.devicePixelRatio) {
		//IE下计算像素比
		dpr = (screen.deviceXDPI / screen.logicalXDPI) || 1;
		dpr = 1 / dpr; //IE下特有的。
	}
	//保存一下，其他地方使用。
	this.dpr = dpr;

	var key = from + '-' + to;

	//保存所有的组合到一个对象。
	var transferObj = {
		'cm-cm': 1,
		'cm-mm': 10,
		'cm-px': 1 / 2.54 * dpi * dpr,
		'cm-pt': 1 / 2.54 * 72,

		'mm-cm': 1 / 10,
		'mm-mm': 1,
		'mm-px': 1 / 10 / 2.54 * dpi * dpr,
		'mm-pt': 1 / 10 / 2.54 * 72,

		'px-cm': 1 / dpi / dpr * 2.54,
		'px-mm': 1 / dpi / dpr * 2.54 * 10,
		'px-px': 1,
		'px-pt': 1 / dpi / dpr * 72,

		'pt-cm': 1 / 72 * 2.54,
		'pt-mm': 1 / 72 * 2.54 * 10,
		'pt-px': 1 / 72 * dpi * dpr,
		'pt-pt': 1,
	}

	return transferObj[key] || 1;

}

//根据初始值填充设置模块数据
ChemSet.setHtml_origin = function(mp) {
	//增加遮罩
	$('.set-container-shade').css('display', 'block');
	//$('.set-container-shade').eq(0).focus();


	if($("input[name='set-unit']").get(0).checked){   // add by hkk 2018.8.24 加上判断条件根据开始的选中状态
		$('#bond-space-absolute').attr('disabled', 'disabled');
		$('#bond-space-ratio').attr('disabled', false);
	}
	else{
		$('#bond-space-absolute').attr('disabled', false);
		$('#bond-space-ratio').attr('disabled', 'disabled');
	}


	//$('#set-container').css('display', 'block');
	var context = this;
	// var dpi = context.getDPI()[0];
	var unit_type_bond = $('#set-bond-unit').val(),
		unit_type_arrow = $('#set-arrow-unit').val(),
		unit_type_flowDiagram = $('#set-flowDiagram-unit').val();
	var unit_multi_bond = 1,
		unit_multi_arrow = 1,
		unit_multi_flowDiagram = 1;

	//像素转化比例计算
	unit_multi_bond = this.calPxRate(unit_type_bond);

	//var mp = Sketcher.molpad;
	//ls20180416添加。在不同的比例。要在设置的基准上换算到100%时的比例。
	var scaleRate = $("#zoomIn-container").attr('data-float') || 1;
	$('.set-bond-container input[id="bond-angle"]').val((mp.s.bond.defaultAngle / Math.PI * 180).toFixed());
	$('#bond-space-ratio').val((mp.s.bond.delta[2][1] * 2 / mp.s.bond.length * 100).toFixed(3));
	$('#bond-space-absolute').val((mp.s.bond.delta[2][1] * 2 / unit_multi_bond / scaleRate).toFixed(3));
	$("#set_gen_bond_len").val((mp.s.bond.length / unit_multi_bond / scaleRate).toFixed(3));
	$('#set_bold_bond_width').val((mp.s.bond.delta[13][1] * 2 / unit_multi_bond / scaleRate).toFixed(3));
	$('#set_gen_bond_width').val((mp.s.bond.width / unit_multi_bond / scaleRate).toFixed(3));
	$('#set_margin_width').val(((mp.s.atom.radius - 6 + 2.68) / unit_multi_bond).toFixed(3));
	$('#set_hash_width').val(((mp.s.bond.hashLineSpace - mp.s.bond.width) / unit_multi_bond / scaleRate).toFixed(3));

	unit_multi_arrow = this.calPxRate(unit_type_arrow);

	//箭头　线条宽度并没有修改
	$('#set-arrow-line-width').val((mp.s.straightArrow.lineWidth / unit_multi_arrow).toFixed(3)); //箭头头部宽度
	$('#set-arrow-length').val((mp.s.straightArrow.defaultLength / unit_multi_arrow / scaleRate).toFixed(3)); //箭头默认长度
	$('#set-arrow-head-width').val((mp.s.straightArrow.width / unit_multi_arrow / scaleRate).toFixed(3));

	unit_multi_flowDiagram = this.calPxRate(unit_type_flowDiagram);

	//放大缩小，箭头这几个配置并没有修改。
	$('#set-flowDiagram-line-width').val((mp.s.flowDiagram.lineWidth / unit_multi_flowDiagram).toFixed(3));
	$('#set-flowDiagram-length').val((mp.s.flowDiagram.defaults.length / unit_multi_flowDiagram).toFixed(3));
	$('#set-flowDiagram-width').val((mp.s.flowDiagram.defaults.width / unit_multi_flowDiagram).toFixed(3));
	$('#set-container input[type="text"]').trigger('blur');
	$('#set-container').fadeIn('1500');
}

ChemSet.prototype.resetSetting = function() {
	var defaultSet = {
		//化学键相关设置
		angle: 120, //单位为度
		space_absolute: 0.127, //对应于delta中的[-2.4, 2.4],//double bond
		space_relative: 0.12, //40 * 0.12 = 4.8
		gen_bond_len: 1.058, //对应于length: 40,//化学键长度
		bold_bond_width: 0.141, //对应于delta中的[-2.66,2.66],//BoldBond
		gen_bond_width: 0.035, //对应于化学键的width: 1.33,
		margin_width: 0.071, //对应于原子radius: 6, 编辑器中的6大致等于2.68。 如果设置的值（单位为像素）大于2.68，则在6的基础上进行设置
		hash_width: 0.060, //对应于[-3.59, 3.59], //wedge/hash bond（这里是wedge和hash化学键的宽度）0.095-0.035.hashline-width;
		//箭头相关设置
		arrow_line: 0.035,
		arrow_width: 0.159,
		arrow_len: 2.117,
		//流程图设置：
		flowDiagram_line: 0.035,
		flowDiagram_len: 2.117,
		flowDiagram_width: 1.058,

		//报错显示
		error_show: true,
		error_hidden: false,
	};
	$('#set-container input[type="text"]').css('border-color', 'rgb(169, 169, 169)');
	$('#set-container input[type="text"] ~p').text('');
	$('#set-container').data('isRight', true);
	this.constructor.resetRight();
	$('#set-bond-unit').val('cm');
	$('#set-arrow-unit').val('cm');
	$('#set-flowDiagram-unit').val('cm');

	//化学键
	$('.set-bond-container input[id="bond-angle"]').val(defaultSet.angle);
	$('.set-bond-container input[value="unit-rel"]').attr('checked', true);
	$('#bond-space-ratio').val(defaultSet.space_relative * 100);
	$('#bond-space-absolute').val(defaultSet.space_absolute);
	$("#set_gen_bond_len").val(defaultSet.gen_bond_len);
	$('#set_bold_bond_width').val(defaultSet.bold_bond_width);
	$('#set_gen_bond_width').val(defaultSet.gen_bond_width);
	$('#set_margin_width').val(defaultSet.margin_width);
	$('#set_hash_width').val(defaultSet.hash_width);

	//反应箭头
	$('#set-arrow-line-width').val(defaultSet.arrow_line); //线条宽度
	$('#set-arrow-head-width').val(defaultSet.arrow_width); //箭头头部宽度
	$('#set-arrow-length').val(defaultSet.arrow_len); //箭头默认长度

	//流程图
	$('#set-flowDiagram-line-width').val(defaultSet.flowDiagram_line);
	$('#set-flowDiagram-length').val(defaultSet.flowDiagram_len);
	$('#set-flowDiagram-width').val(defaultSet.flowDiagram_width);

	//报错显示
	$('.set-error-container input[value="show"]').attr('checked', true);

	var dpi = this.constructor.getDPI()[0];
	var unit_multi = 1 / 2.54 * dpi;
	var scaleRate = $("#zoomIn-container").attr('data-float') || 1;
	if (defaultSet.space_absolute !== undefined) {
		defaultSet.space_absolute = defaultSet.space_absolute * unit_multi * scaleRate;
	}
	defaultSet.gen_bond_len = defaultSet.gen_bond_len * unit_multi * scaleRate;
	defaultSet.bold_bond_width = defaultSet.bold_bond_width * unit_multi * scaleRate;
	defaultSet.gen_bond_width = defaultSet.gen_bond_width * unit_multi * scaleRate;
	defaultSet.margin_width = defaultSet.margin_width * unit_multi;
	defaultSet.hash_width = defaultSet.hash_width * unit_multi * scaleRate;

	defaultSet.arrow_line = defaultSet.arrow_line * unit_multi;
	defaultSet.arrow_width = defaultSet.arrow_width * unit_multi * scaleRate;
	defaultSet.arrow_len = defaultSet.arrow_len * unit_multi * scaleRate;

	defaultSet.flowDiagram_line = defaultSet.flowDiagram_line * unit_multi;
	defaultSet.flowDiagram_width = defaultSet.flowDiagram_width * unit_multi;
	defaultSet.flowDiagram_len = defaultSet.flowDiagram_len * unit_multi;

	//取消acs状态
	if (window.acs) {
		window.acs.disabled();
	}

	this.setBond(defaultSet);
	this.setArrow(defaultSet);
	this.setFlowdiagram(defaultSet);
	this.setError(defaultSet);
}

ChemSet.setHtml_bond = function(multiValue) {
	//化学键
	var space_absolute = (parseFloat($('#bond-space-absolute').val()) * multiValue).toFixed(3);
	$('#bond-space-absolute').val(space_absolute);
	var gen_bond_len = (parseFloat($("#set_gen_bond_len").val()) * multiValue).toFixed(3);
	$("#set_gen_bond_len").val(gen_bond_len);
	var bold_bond_width = (parseFloat($('#set_bold_bond_width').val()) * multiValue).toFixed(3);
	$('#set_bold_bond_width').val(bold_bond_width);
	var gen_bond_width = (parseFloat($('#set_gen_bond_width').val()) * multiValue).toFixed(3);
	$('#set_gen_bond_width').val(gen_bond_width);
	var margin_width = (parseFloat($('#set_margin_width').val()) * multiValue).toFixed(3);
	$('#set_margin_width').val(margin_width);
	var hash_width = (parseFloat($('#set_hash_width').val()) * multiValue).toFixed(3);
	$('#set_hash_width').val(hash_width);


}

ChemSet.setHtml_arrow = function(multiValue) {
	//反应箭头
	var arrow_line_width = (parseFloat($('#set-arrow-line-width').val()) * multiValue).toFixed(3); //线条宽度
	$('#set-arrow-line-width').val(arrow_line_width);
	var arrow_head_width = (parseFloat($('#set-arrow-head-width').val()) * multiValue).toFixed(3); //箭头头部宽度
	$('#set-arrow-head-width').val(arrow_head_width);
	var arrow_len = (parseFloat($('#set-arrow-length').val()) * multiValue).toFixed(3); //箭头默认长度
	$('#set-arrow-length').val(arrow_len);
}

ChemSet.setHtml_flowDiagram = function(multiValue) {
	//流程图
	var flowDiagram_line_width = (parseFloat($('#set-flowDiagram-line-width').val()) * multiValue).toFixed(3);
	$('#set-flowDiagram-line-width').val(flowDiagram_line_width);
	var flowDiagram_len = (parseFloat($('#set-flowDiagram-length').val()) * multiValue).toFixed(3);
	$('#set-flowDiagram-length').val(flowDiagram_len);
	var flowDiagram_width = (parseFloat($('#set-flowDiagram-width').val()) * multiValue).toFixed(3);
	$('#set-flowDiagram-width').val(flowDiagram_width);
}

ChemSet.getDPI = function() {
	var arrDPI = new Array();
	if (window.screen.deviceXDPI !== undefined) {
		arrDPI[0] = window.screen.deviceXDPI;
		arrDPI[1] = window.screen.deviceYDPI;
	} else {
		var tempNode = document.createElement("DIV");
		tempNode.style.cssText = "width:1in; height:1in; position:absolute; left:0px; top: 0px; z-index:9999;visibility:hidden";
		document.body.appendChild(tempNode);
		arrDPI[0] = parseInt(tempNode.offsetWidth);
		arrDPI[1] = parseInt(tempNode.offsetHeight);
		tempNode.parentNode.removeChild(tempNode);
	}
	return arrDPI;
}

ChemSet.prototype.errHandler = function(status) {
	alert(status.log); //后面可以修改交互，让出错地方的文本框边框使用红色实线
	return;
}

//像素与cm转化：1px = 1/dpi * 2.54; 像素与pt：1px = 72/dpi pt
ChemSet.prototype.setBond = function(settingObj_px) {
	//像素单位默认值
	/**
	var settingObj_px = {
		angle: 150,//单位为度
		space_absolute: 4.8,//对应于delta中的[-2.4, 2.4],//double bond
		space_relative: 0.12,//40 * 0.12 = 4.8
		gen_bond_len: 40, //对应于length: 40,//化学键长度
		bold_bond_width: 5.32,//对应于delta中的[-2.66,2.66],//BoldBond
		gen_bond_width: 1.33, //对应于化学键的width: 1.33,
		margin_width: 2.68, //对应于原子radius: 6, 编辑器中的6大致等于2.68。 如果设置的值（单位为像素）大于2.68，则在6的基础上进行设置
		hash_width: 3.59,//对应于hashLineSpace: 3.59，
	};
	**/
	//根据传递的参数进行配置文件的更改
	this.mp.s.bond.defaultAngle = settingObj_px.angle / 180 * Math.PI;
	//如果使用绝对值
	if (settingObj_px.space_absolute !== undefined) {
		this.mp.s.bond.delta[2][0] = -settingObj_px.space_absolute / 2;
		this.mp.s.bond.delta[2][1] = settingObj_px.space_absolute / 2;
		this.mp.s.bond.delta[3][0] = -settingObj_px.space_absolute;
		this.mp.s.bond.delta[3][1] = -settingObj_px.space_absolute;
	}
	//如果使用相对值
	else {
		this.mp.s.bond.delta[2][0] = -settingObj_px.space_relative * settingObj_px.gen_bond_len / 2;
		this.mp.s.bond.delta[2][1] = settingObj_px.space_relative * settingObj_px.gen_bond_len / 2;
		this.mp.s.bond.delta[3][0] = -settingObj_px.space_relative * settingObj_px.gen_bond_len;
		this.mp.s.bond.delta[3][1] = settingObj_px.space_relative * settingObj_px.gen_bond_len;
	}
	this.mp.s.bond.length = settingObj_px.gen_bond_len;
	this.mp.s.bond.delta[13][0] = -settingObj_px.bold_bond_width / 2;
	this.mp.s.bond.delta[13][1] = settingObj_px.bold_bond_width / 2;
	this.mp.s.bond.width = settingObj_px.gen_bond_width;
	/**
	 * @date: 2018/1/9
	 * @author: mjsun
	 * @desc: 线条宽度变大时，调整双键的间隙
	 */
	//begin
	var originBondWidth = 1.46;
	var scaleRate = $("#zoomIn-container").attr('data-float') || 1;
	var originBondWidth = originBondWidth * scaleRate;
	var widthDelta = this.mp.s.bond.width - originBondWidth;
	this.mp.s.bond.delta[2][0] -= widthDelta / 2;
	this.mp.s.bond.delta[2][1] += widthDelta / 2;
	this.mp.s.bond.delta[3][0] -= widthDelta / 2;
	this.mp.s.bond.delta[3][1] += widthDelta / 2;
	//end
	this.mp.s.atom.radius = settingObj_px.margin_width - 2.68 + 6;
	this.mp.s.bond.hashLineSpace = settingObj_px.hash_width + settingObj_px.gen_bond_width;

	//	this.mp.mol.invalidateAll();
	//	this.mp.mol.validateAll();

	this.mp.draw();
}

ChemSet.prototype.setArrow = function(settingObj) {
	this.mp.s.straightArrow.lineWidth = settingObj.arrow_line;
	this.mp.s.straightArrow.width = settingObj.arrow_width;
	this.mp.s.straightArrow.length = settingObj.arrow_width * 2.5; //目前箭头头部的长度是箭头头部的宽度的2.5倍
	this.mp.s.straightArrow.defaultLength = settingObj.arrow_len;

	this.mp.s.curveArrow.lineWidth = settingObj.arrow_line;
	this.mp.s.curveArrow.defaultLength = settingObj.arrow_len;
	this.mp.s.reverseArrow.lineWidth = settingObj.arrow_line;
	this.mp.s.reverseArrow.defaultLength = settingObj.arrow_len;
}

ChemSet.prototype.setFlowdiagram = function(settingObj) {
	this.mp.s.flowDiagram.lineWidth = settingObj.flowDiagram_line;
	this.mp.s.flowDiagram.defaults.length = settingObj.flowDiagram_len;
	this.mp.s.flowDiagram.defaults.width = settingObj.flowDiagram_width;
}

ChemSet.prototype.setError = function(settingObj) {
	this.mp.s.atom.incorrect.color = settingObj.error_show ? "#F66" : "#FFF";
	this.mp.s.errorSet.show = settingObj.error_show ? true : false;
}