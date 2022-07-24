$(function(){
	//탭
	$('ul.tab_area li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tab_area li').removeClass('active');
		$('.tab-content').removeClass('active');

		$(this).addClass('active');
		$("#"+tab_id).addClass('active');
	});

	//옵션 클릭시, 하단 슬라이드
	$(".option_btn").click(function(){
		$("#pop_slide").slideDown(600);
		$('#pop_bg').show();
	});
	$(".cancel_btn,.confirm_btn").click(function(){
		$("#pop_slide").slideUp(600);
		$('#pop_bg').hide();
	});
});
