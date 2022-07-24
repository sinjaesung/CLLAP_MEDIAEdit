$(function () {
	let seoul = ['전체', '종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구,'
		, '동작구', '관악구', '서초구', '강남구', '송파구', '강동구']
	let busan = ['전체','중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군']
	let daegu = ['전체','중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군']
	let incheon = ['전체','중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군']
	let gwangju = ['전체','동구', '서구', '남구', '북구', '광산구']
	let daejeon = ['전체','동구', '중구', '서구', '유성구', '대덕구']
	let ulsan = ['전체','중구', '남구', '동구', '북구', '울주군']
	let gyunggi = ['전체','수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '남양주시', '화성시', '평택시', '의정부시', '시흥시', '파주시',
		'광명시', '김포시', '군포시', '광주시', '이천시', '양주시', '오산시', '구리시', '안성시', '포천시', '의왕시', '하남시', '여주시', '양평군', '동두천시', '과천시', '가평군', '연천군']
	let gangwon = ['전체','춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군']
	let chungbuk = ['전체','청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '진천군', '괴산군', '음성군', '단양군', '증평군']
	let chungnam = ['전체','천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군']
	let jeonbuk = ['전체','전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군']
	let jeonnam = ['전체','목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군']
	let gyungbuk = ['전체','포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군']
	let gyungnam = ['전체','창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군']
	let jeju = ['전체','제주시', '서귀포시']


	$('#share_address').change(function () {
		let share_address = $('#share_address option:selected').val()
		let share_address_detail = new Array()

		if (share_address == '서울') {
			share_address_detail = seoul
		} else if (share_address == '부산') {
			share_address_detail = busan
		} else if (share_address == '대구') {
			share_address_detail = daegu
		} else if (share_address == '인천') {
			share_address_detail = incheon
		} else if (share_address == '광주') {
			share_address_detail = gwangju
		} else if (share_address == '대전') {
			share_address_detail = daejeon
		} else if (share_address == '울산') {
			share_address_detail = ulsan
		} else if (share_address == '경기') {
			share_address_detail = gyunggi
		} else if (share_address == '강원') {
			share_address_detail = gangwon
		} else if (share_address == '충북') {
			share_address_detail = chungbuk
		} else if (share_address == '충남') {
			share_address_detail = chungnam
		} else if (share_address == '전북') {
			share_address_detail = jeonbuk
		} else if (share_address == '전남') {
			share_address_detail = jeonnam
		} else if (share_address == '경북') {
			share_address_detail = gyungbuk
		} else if (share_address == '경남') {
			share_address_detail = gyungnam
		} else if (share_address == '제주') {
			share_address_detail = jeju
		} else if (share_address == '세종') {
			share_address_detail = ['세종특별자치시']
		}


		$('#share_address_detail').children().remove()

		for (address_detail in share_address_detail) {
			let option = document.createElement('option')
			option.value = share_address_detail[address_detail]
			option.innerHTML = share_address_detail[address_detail]
			$('#share_address_detail').append(option)
		}

	})

	$('#search_spaceBtn').click(() => {
		let start_date = $('#start_date').val()
		let end_date = $('#end_date').val()
		let keyword = $('#keyword').val()
		let share_biz_type = $('#share_biz_type option:selected').val()
		let share_address = $('#share_address option:selected').val()
		let share_address_detail = $('#share_address_detail option:selected').val()

		/*if(start_date == "" || end_date == ""){
			 alert('기간을 선택해주세요')
			 return false;
	 	}*/

		location.replace('search_space?start_date=' + start_date + '&end_date=' + end_date + '&keyword=' + keyword +
			'&share_biz_type=' + share_biz_type + '&share_address=' + share_address + '&share_address_detail=' + share_address_detail)

	})
	
	$('#search_approval_spaceBtn').click(()=>{
		
		let start_date = $('#start_date').val()
		let end_date = $('#end_date').val()
		let keyword = $('#keyword').val()
		let share_biz_type = $('#share_biz_type option:selected').val()
		let share_address = $('#share_address option:selected').val()
		let share_address_detail = $('#share_address_detail option:selected').val()
		let share_approval = $('input[name="share_approval"]:checked').val()

		/*if(start_date == "" || end_date == ""){
			 alert('기간을 선택해주세요')
			 return false;
	 	}*/

		location.replace('search_space?start_date=' + start_date + '&end_date=' + end_date + '&keyword=' + keyword +
			'&share_biz_type=' + share_biz_type + '&share_address=' + share_address + '&share_address_detail=' + share_address_detail
			+ '&share_approval=' + share_approval + '&approval=ok')

	})

}) // function End