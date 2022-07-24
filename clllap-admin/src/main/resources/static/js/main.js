$(function(){
	$("#main_wrap .more_btn a").click(function(){
		if($(this).hasClass("on")){
			$("#main_wrap .more_btn a").removeClass("on");
			$("#main_wrap .list_on").slideUp("fast");
			/*$(this).find(".more_btn a img").attr("src","../img/main/arrow_bottom_gr.png");*/
		}else{
			$("#main_wrap .more_btn a").removeClass("on");
			$("#main_wrap .list_on").slideUp("fast");
			/*$("#main_wrap .more_btn a").find(".more_btn a img").attr("src","../img/main/arrow_bottom_gr.png");*/
			$(this).addClass("on");
			$("#main_wrap .list_on").slideDown("fast");
			/*$(this).find(".more_btn a img").attr("src","../img/main/arrow_bottom_gr.png"); /*탑이미지로 바뀌어야함. 나중에 추가되면 여기 수정하기.*/
		}
	});
});
