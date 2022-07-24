// hooks.js
import { useState, useEffect } from "react";
import { __RouterContext } from "react-router";

const privacy_string=`당사가 이용하는 개인정보의 유형

 

당사가 수집하고 이용하는 귀하에 대한 정보는 다음과 같습니다.

 

귀하의 프로필 정보.

귀하는 본 플랫폼에 가입하는 시점의 정보를 당사에게 제공하며, 이용자명, 비밀번호, (해당하는 경우에만) 생년월일, 이메일 주소 및/또는 전화번호, 귀하가 이용자 프로필에서 공개하는 정보 및 귀하의 사진 또는 프로필 비디오 등이 이에 해당합니다.

 

이용자 콘텐츠 및 행태 정보.

당사는 귀하가 본 플랫폼에서 생성한 콘텐츠를 처리하며, 처리 대상 콘텐츠에는 귀하가 설정한 선호사항(언어 선택 등), 귀하가 업로드하거나 생성한 사진, 비디오가 포함됩니다(이하 “이용자 콘텐츠”). 당사는 귀하가 이용자 콘텐츠의 생성, 이전 또는 업로드 시 이용자 콘텐츠의 저장이나 업로드를 선택하지 않더라도 귀하에게 오디오 옵션과 기타 맞춤형 추천을 하기 위하여 프리 로딩을 통하여 이용자 콘텐츠를 수집합니다. 귀하가 이용자 콘텐츠에 효과를 적용할 경우, 당사는 효과를 제거한 귀하의 이용자 콘텐츠를 수집할 수 있습니다. 당사는 이용자 콘텐츠에 포함된 사물과 풍경의 식별, 이미지에 얼굴과 신체가 존재하는지 여부와 그 위치 그리고 그 특징과 성질, 오디오의 성질 및 귀하의 이용자 콘텐츠에서 들려주는 단어 등 이용자 콘텐츠의 일부인 이미지와 오디오에 관한 정보를 수집할 수 있습니다. 당사는 이와 같이 수집한 정보를 특별 영상 효과 부여, 콘텐츠 심의, 인구학적 분류, 콘텐츠/광고 추천 및 기타 개인식별불가능한 정보처리를 위하여 이용합니다. 나아가, 당사는 귀하의 기기 클립보드에 포함된 텍스트, 이미지 및 비디오를 포함하는 콘텐츠를 귀하의 동의를 얻어 접근할 수 있습니다. 예를 들어, 귀하가 제3의 플랫폼과 콘텐츠 공유를 개시하기로 결정하거나 클립보드의 콘텐츠를 Clllap 앱에 삽입하기로 결정하는 경우, 당사는 귀하의 클립보드에 저장된 정보에 접근하여 귀하의 결정을 실행합니다. 당사는 귀하가 참여하는 설문, 챌린지, 대회를 통해 정보를 수집합니다. 아울러, 당사는 귀하의 본 플랫폼 이용과 관련된 정보, 즉 귀하가 본 플랫폼에 참여하는 방식에 대한 정보를 수집하며, 당사가 귀하에게 보여주는 콘텐츠와 귀하가 상호작용하는 방식, 귀하가 보는 광고 및 비디오, 귀하가 겪는 문제, 귀하가 좋아한 콘텐츠 등이 이에 포함됩니다. 또한, 당사는 귀하에게 맞춤형 콘텐츠를 제공하기 위하여 귀하의 관심사, 성별 등 귀하의 선호를 유추합니다. 당사는 귀하에게 맞춤형 광고를 제공하고 새로운 서비스 및 기회를 안내하기 위하여 전술한 정보를 이용합니다.

 

제3자로부터 제공받는 정보.

귀하는 제3자로 하여금, 또는 다른 플랫폼을 통하여, 특정 정보를 당사와 공유하도록 선택할 수 있고, 귀하가 본 플랫폼을 이용함으로써 당사가 자동적으로 제3자로부터 정보를 수집할 수 있습니다. 당사는 아래와 같이 제3자로부터 제공받는 정보에 관하여 상세히 규정하고 있습니다.

 

사업 파트너

 

귀하가 제3의 소셜네트워크 계정(예: Facebook, Twitter, Instagram, Google 등) 정보를 이용하여 본 플랫폼을 이용하거나 본 플랫폼에 등록 또는 로그인하는 경우, 귀하는 귀하의 이용자명, 공개 프로필 및 해당 계정과 관련된 여타 정보를 당사에게 제공하게 되거나 동 정보를 당사에게 제공하는 것을 허용하게 됩니다. 또한, 당사는 귀하의 앱 ID, 액세스 토큰 및 참조 URL과 같은 특정 정보를 귀하의 소셜네트워크와 공유합니다. 귀하의 Facebook 주소록을 당사와 공유하는 것과 관련된 자세한 내용은 다른 이용자 찾기 및 친구 초대 항목을 참고하여 주시기 바랍니다.  귀하가 귀하의 Clllap 계정을 다른 서비스와 연동할 경우, 당사는 귀하의 해당 서비스 이용 정보를 수집할 수 있습니다.

 

광고주, 광고 네트워크 및 분석 서비스 제공자

 

당사는 귀하의 관심사를 최대한 유추하여 보다 연관성이 높은 광고를 제공하기 위해 귀하로부터 수집한 정보와 더불어 귀하와 본 플랫폼, 다른 제3자의 사이트 및 앱 사이의 상호작용에 관한 정보를 이용합니다. 당사는 전술한 정보를 통해 귀하가 방문한 웹사이트, 귀하가 다운로드한 앱, 귀하의 구입내역 등을 파악하여 귀하의 향후 관심사를 예측하고, 당사의 플랫폼에서의 광고가 얼마나 효과적인지를 평가합니다. 당사는 쿠키 및 당사 플랫폼상의 유사한 기술을 이용하여 당사의 플랫폼에서 광고를 하고 귀하가 방문하는 사이트 및 앱을 운영하는 제3자로부터 수령한 유사한 정보를 이용하여 전술한 정보를 수집합니다.

 

귀하와 관련하여 수집하는 기술정보.

당사는 귀하가 본 플랫폼 접근 시 이용하는 기기의 IP주소, 이용자 에이전트, 이동통신사업자, 설정 시간대, 광고식별자, 기기 모델, 기기 시스템, 네트워크 유형, 기기 ID, 화면 해상도, 운영시스템, 앱, 파일명과 유형, 자판사용 패턴이나 리듬, 배터리 상태, 오디오 설정 및 연결된 오디오 장치 등 정보를 수집합니다. 귀하가 복수의 기기에서 로그인할 경우, 당사는 귀하의 프로필 정보를 이용하여 복수의 기기에서 수행되는 귀하의 활동을 식별할 수 있습니다. 또한, 당사는 본 플랫폼에 로그인하기 위해 사용하는 기기와 다른 기기에서 수집한 정보를 귀하와 연계할 수도 있습니다.

 

위치.

당사는 귀하의 SIM 카드 및 IP주소를 기준으로 위치정보 등 귀하의 대략적인 위치에 대한 정보를 수집합니다. 귀하의 동의를 받아 정확한 위치 데이터(GPS)를 수집할 수도 있습니다.

 

 

신분이나 연령 입증.

당사는 귀하가 검증 계정 등 특정 기능을 이용하거나 또는 기타 검증이 요구되는 상황에서 귀하가 본 플랫폼을 이용할 수 있는 연령인지 확인하기 위하여 귀하의 신분이나 연령 증빙을 요구할 수 있습니다.

쿠키

 

당사, 당사의 벤더 및 서비스 제공사는 쿠키 및 그 외 유사한 기술(예: 웹 비콘(web beacons), 플래시 쿠키(flash cookies) 등)(이하 “쿠키”)를 이용하여 정보를 자동으로 수집하고, 귀하가 클릭한 웹페이지 및 귀하가 본 플랫폼을 이용하는 방식을 측정하고 분석하며, 귀하의 본 플랫폼 이용 경험을 개선하고, 당사의 서비스를 개선하고, 본 플랫폼 및 귀하의 기기상에서 귀하에게 맞춤형 광고를 제공합니다. 쿠키는 본 플랫폼이 특정 기능을 제공할 수 있도록 합니다. 웹 비콘은 이미지 내에 삽입된 매우 작은 이미지나 데이터로서 “픽셀 태그(pixel tag)”나 “클리어(clear) GIF”라고도 하며, 쿠키, 페이지를 본 시간 및 날짜, 픽셀 태그가 설치된 페이지의 설명 및 귀하의 컴퓨터나 기기로부터 수집된 이와 유사한 정보를 인식합니다. 귀하는 본 플랫폼을 이용함으로써 쿠키 이용에 동의하게 됩니다.

 

또한, 당사는 당사의 사업 파트너, 광고 네트워크 및 기타 광고 벤더 및 서비스 제공사(분석 벤더 및 서비스 제공사 포함)가 쿠키를 통해 귀하의 온라인 활동에 대한 정보를 수집하는 것을 허용합니다. 당사는 귀하의 이메일, 여타 로그인 또는 기기정보를 이용하여 귀하의 기기를 통한 당사 플랫폼상에서의 활동과 연동합니다. 이와 같은 제3자는 당사의 플랫폼 및 온라인상에서 귀하의 관심사, 선호 및 특징에 맞추어 광고를 게재하기 위해 이러한 정보를 이용할 수 있습니다. 당사는 전술한 제3자의 개인정보 처리에 대해 책임이 없으며, 본 정책에서는 제3자의 정보처리 실무를 다루지 않습니다.

 

귀하는 귀하의 브라우저 설정을 조정하여 쿠키를 거부하거나 비활성화할 수 있습니다. 각 브라우저가 상이하기 때문에, 귀하의 브라우저가 제공하는 지시사항이나 설명을 참고하시기 바랍니다. 특정 유형의 쿠키를 거부하거나 비활성화하려면 추가 조치가 필요할 수 있습니다. 예를 들어, 브라우저와 모바일 앱이 기능하는 방식에 차이가 있으므로 브라우저상의 맞춤광고에 이용되는 쿠키를 차단하거나 모바일 앱상 맞춤광고를 차단하기 위해서는 상이한 조치를 취해야 할 수 있으며, 이러한 경우 귀하의 기기설정이나 모바일 앱 허용 권한을 조정하여 조치를 취할 수 있습니다. 또한, 귀하의 차단 선택은 귀하가 차단 시 사용하는 특정 브라우저나 기기에 한하여 적용되므로, 각 브라우저나 기기에 대해 별도의 차단 조치가 필요할 수 있습니다. 쿠키를 거부하거나 비활성화하거나 삭제하는 경우, 본 플랫폼의 일부 기능이 귀하에게 제공되지 않을 수 있습니다.

귀하의 개인정보를 이용하는 방식

 

당사는 당사가 귀하에 대해 수집하는 정보를 다음과 같은 방식으로 이용합니다.  

 

당사 서비스의 변경 사항을 귀하에게 통보하기 위하여

귀하에게 이용자 지원을 제공하기 위하여

귀하가 제공받는 콘텐츠를 개인화하고, 귀하의 관심사에 해당하는 맞춤형 콘텐츠를 귀하에게 제공하기 위하여

귀하와 의사소통하기 위하여

본 플랫폼의 남용, 본 플랫폼상의 사기행위 및 불법행위를 감지하기 위하여

콘텐츠가 귀하 및 귀하의 기기에 가장 효과적인 방식으로 제공되도록 조치하기 위하여

본 플랫폼을 개선, 홍보 및 개발하고 본 플랫폼상의 인기 토픽, 해시태그 및 캠페인을 홍보하기 위하여

안정성 및 보안을 보장하기 위해 데이터 분석을 실행하고 본 플랫폼에 대한 테스트를 진행하기 위하여

(법률상 요구되는 경우) 귀하가 본 플랫폼을 이용할 수 있는 적정 연령인지 확인하기 위하여

귀하에게 맞춤형 광고를 제공하기 위하여

(귀하의 관할지역에서 위치기반 서비스가 제공되는 경우) 귀하에게 위치기반 서비스를 제공하기 위하여

당사의 알고리즘을 학습시키기 위하여

당사의 약관 및 정책을 집행하기 위하여

장애처리를 포함하여 본 플랫폼을 관리하기 위하여

 

귀하의 개인정보를 공유하는 방식

 

당사는 다음과 같은 제3자와 귀하의 정보를 공유하나, 공유의 범위는 귀하가 거주하는 관할지역에 따라 달라질 수 있습니다.

 

사업 파트너

 

귀하가 귀하의 소셜네트워크 계정(예: Facebook, Twitter, Instagram, Google 등) 정보를 이용하여 본 플랫폼에 등록하는 경우, 귀하는 귀하의 전화번호, 이메일 주소, 이용자명 및 공개된 프로필을 당사에게 제공하거나 귀하의 소셜네트워크가 동 정보를 당사에게 제공하는 것을 허용하게 됩니다. 또한, 당사는 귀하의 앱 ID, 액세스 토큰 및 참조 URL(referring URL)과 같은 특정 정보를 귀하의 소셜네트워크와 공유합니다.  귀하가 제3자 서비스가 귀하의 계정에 접근하는 것에 동의할 경우, 당사는 해당 제3자와 귀하에 대한 특정 정보를 공유할 것입니다. 귀하의 동의에 따라 제3자는 귀하의 계정정보 및 귀하가 제공에 동의한 기타 정보를 수집할 수 있습니다.

 

귀하가 타 소셜미디어 플랫폼에 콘텐츠를 공유하기로 선택하는 경우, 영상, 이용자명 및 이에 수반되는 글자가 해당 플랫폼에 공유되며, WhatsApp과 같은 인스턴트 메신저를 통해 공유하는 경우에는 콘텐츠로 연결되는 링크가 공유됩니다.

 

서비스 제공사

 

당사는 클라우드 서비스 제공사 및 콘텐츠 심의 서비스 제공사 등 본 플랫폼이 안전하고 즐거운 장소가 되도록 클라우드 사업자나 컨텐츠 심의 사업자 등 당사의 사업을 지원하는 서비스 제공사와 플랫폼 홍보를 지원하는 서비스 제공사에게 정보 및 콘텐츠를 제공합니다.

 

분석 서비스 제공사

 

당사는 본 플랫폼의 최적화 및 개선을 돕는 분석 서비스 제공사를 활용합니다. 제3자인 분석 서비스 제공사는 맞춤형 광고에 관한 지원도 당사에게 제공합니다.

 

광고주 및 광고 네트워크

 

당사는 광고를 보거나 클릭한 본 플랫폼 이용자의 수와 그 유형을 보여주기 위해 광고주 및 제3자인 측정 서비스 제공사와 정보를 공유합니다. 단, 귀하를 식별할 수 있는 정보는 공유하지 않습니다. 당사는 측정 서비스 제공사와 귀하의 기기 ID를 공유하여 귀하의 본 플랫폼상 활동을 다른 웹사이트에서의 귀하의 활동과 연결하고, 그 후 귀하의 관심사에 해당할 수 있는 광고를 귀하에게 보여주기 위하여 전술한 정보를 이용합니다.

 

Clllap 기업집단

 

당사는 본 플랫폼의 개선 및 최적화를 포함하여 불법 이용을 방지하고 이용자를 지원하며 본 플랫폼의 최적화, 개선, 기타 제공하기 위하여 Clllap 기업집단 내 다른 구성원, 자회사 또는 계열사와 귀하의 정보를 공유할 수 있습니다.

 

법률의 집행

 

당사는 법적으로 요구되거나 다음과 같은 목적을 위하여 합리적으로 요구되는 경우 귀하의 정보를 사법기관, 공공기관 또는 기타 기관과 공유합니다:

 

법적 의무, 절차 또는 요청을 준수하기 위하여

위반 가능성에 대한 조사를 포함한 당사의 서비스약관 및 기타 계약, 정책 및 기준의 집행을 위하여

보안, 사기 또는 기술적 문제의 감지, 방지 또는 처리를 위하여

법률에 따라 요구되거나 허용되는 바에 따라 당사, 당사의 이용자, 제3자 및 공공의 권리, 재산 내지 안전을 보호하기 위하여(사기 방지 및 신용위험 감소를 위하여 다른 회사 및 기관과 정보를 교환하는 것 포함)

 

 

매각 또는 합병

 

당사는 법률에서 규정하는 바에 따라 귀하의 동의를 받거나 귀하에게 통지를 한 후, 아래와 같이 귀하의 정보를 제3자에게 공개할 수 있습니다.

 

(청산, 파산 또는 기타 이유를 불문하고) 당사가 여하한 사업 또는 자산을 매각하거나 매입하는 경우, 당사는 해당 사업 또는 자산의 잠재적 매수인이나 매도인에게 귀하의 정보를 공개합니다.

당사가 매각, 매입, 합병되거나 다른 회사 또는 사업에 의해 인수되거나 다른 회사 또는 사업과 파트너 관계가 되는 경우, 혹은 당사의 자산 전부 또는 일부를 매각하는 경우, 이용자 정보가 해당 거래에 기하여 이전되는 자산에 포함될 수 있습니다.

개인정보를 저장하는 장소

 

당사가 귀하로부터 수집하는 개인정보는 귀하가 거주하는 국가 밖에 위치한 전세계 여러 국가 서버에 저장될 수 있습니다. 당사는 귀하에게 세계 어디에서나 지속적으로 서비스를 제공하기 위하여 전세계 여러 국가에 주요 서버를 유지하고 있습니다.

 

 

 

귀하의 권리

 

귀하는 Clllap에 가입함에 따라 귀하의 프로필 정보 대부분에 접속하고 이를 편집할 수 있습니다. 귀하는 귀하가 생성한 이용자 콘텐츠를 삭제할 수 있습니다. 또한, 당사는 귀하가 조정할 수 있는 여러 가지 설정 툴을 제공합니다. 원하는 경우, 귀하는 설정에서 귀하의 계정을 전부 삭제할 수 있습니다. 귀하는 귀하가 소재하는 국가의 관련 법률에 따라 정보 접근 및 삭제 등에 관한 권리를 가집니다. 툴 사용법에 대해 질문이 있거나 귀하의 거주국가에서 귀하가 가지는 권리에 대해 알고 싶거나 이를 행사하고자 하는 경우, 홈페이지를 통해 연락하시기 바랍니다.

개인정보에 대한 보안

 

당사는 귀하의 정보가 본 정책에 따라 안전하게 처리되도록 조치를 취합니다. 다만, 유감스럽게도 인터넷을 통한 정보 전송은 보안이 완전히 보장되지 않습니다. 당사는 암호화 등의 방법으로 귀하의 개인정보를 보호할 것이나, 본 플랫폼을 통해 전송되는 귀하의 정보에 대한 보안을 보장할 수 없습니다. 정보 전송의 위험에 따른 책임은 귀하가 부담합니다.

 

당사는 다양한 위험의 가능성, 귀하 및 다른 이용자의 권리 및 자유의 심각성과 위험성에 상응하는 수준의 보안을 갖추기 위해 적절한 기술적, 관리적 조치를 마련하고 있습니다. 당사는 기술적, 관리적 조치를 유지하며, 해당 조치를 수시로 보완하여 당사 시스템의 전반적인 보안을 개선할 것입니다.

 

당사의 플랫폼은 당사 파트너의 네트워크, 광고주 및 관계사의 웹사이트로 연결되는 링크 또는 동 웹사이트로부터의 링크를 포함합니다. 귀하가 해당 웹사이트로 연결되는 링크를 따라가는 경우 해당 웹사이트가 자체 개인정보 처리방침을 보유하고 있으며 당사는 해당 정책에 대하여 책임을 지지 않는다는 점을 참고하여 주시기 바랍니다. 해당 웹사이트에 정보를 제공하기에 앞서 해당 웹사이트의 정책을 확인하시기 바랍니다.

 

 

개인정보 보유기간

 

당사는 귀하에게 서비스를 제공하기 위하여 필요한 기간 동안 귀하의 정보를 보유합니다. 귀하에게 서비스를 제공하기 위한 목적으로 귀하의 정보를 보유할 필요가 없어지면, 당사는 해당 정보를 보유할 적법한 사업목적이 존재하는 기간에 한하여 귀하의 정보를 보유합니다. 단, 당사의 법적 의무의 이행 또는 당사의 법적 청구의 성립, 행사 또는 방어를 위하여 당사가 전술한 기간을 초과하여 귀하의 정보를 보유할 수 있는 경우가 있을 수 있습니다.

 

귀하가 본 플랫폼의 이용을 종료한 이후, 당사는 귀하의 정보를 통합하여 익명으로 저장합니다.

 

 

아동 정보

 

Clllap은 만 13세 미만의 아동을 대상으로 하지 않습니다. 현지 규제로 인하여만 13세보다 더 높은 연령 제한이 적용되는 경우도 있으므로, 귀하에게 적용되는 현지 개인정보 처리방침에서 자세한 정보를 확인하시기 바랍니다. 당사가 기준 연령 미만의 아동에 대한 개인정보를 보유하거나 수집했다고 의심되는 경우 홈페이지를 통해 연락하시기 바랍니다.

이용자 불만

 

당사가 귀하의 개인정보를 처리하는 방식에 대해 불만을 제기하고자 하는 경우,  홈페이지를 통해 먼저 당사에 연락하시면 귀하의 요청을 최대한 신속하게 처리할 수 있도록 노력하겠습니다. 전술한 사항은 귀하가 관련 개인정보 보호 규제기관에 민원을 제기할 수 있는 귀하의 권리를 침해하지 않습니다.  

 

 

변경

 

당사는 본 개인정보 처리방침을 수시로 개정할 수 있습니다. 본 방침을 개정할 경우, 당사는 본 방침의 서두에 기재된 “최종 업데이트” 일자를 수정하여 신규 방침을 게시하고, (해당되는 경우) 관련 법령에 따라 통지를 제공하는 방식으로 고지하겠습니다. 귀하가 정책의 개정 일자 이후에 본 플랫폼에 계속 접속하거나 이를 이용하는 것은 귀하가 개정된 정책에 동의하였음을 의미합니다.  귀하가 개정된 정책에 동의하지 않는다면 본 플랫폼에 대한 접속 및 이용을 중단해야 합니다. 개인정보 처리방침의 이전 버전을 확인하시려면 홈페이지를 방문 바랍니다.

 

 

 

연락처

 

본 정책에 대한 질의 사항, 의견 및 요청은 홈페이지를 통해 연락하시기 바랍니다.  

 

특정 관할지역에 적용되는 추가 약관

 

귀하가 본건 서비스에 접속하거나 본건 서비스를 이용하는 관할지역에 적용되는 특정 관할지역 추가약관(이하 “추가약관”)의 조항과 본 정책의 본문 조항이 충돌하는 경우, 해당 관할지역의 추가약관이 우선 적용됩니다.

 

대한민국.

 

귀하가 한국에서 당사의 서비스를 이용하고 있는 경우, 하기 추가 약관이 적용됩니다. 추가 조항과 본 정책의 본문 조항이 충돌하는 경우, 추가 약관이 우선 적용됩니다.

 

귀하의 개인정보를 공유하는 방식.

본 정책의 본문에 부연하여, 당사가 당사의 광고 및 마케팅 캠페인의 일환으로 귀하가 귀하의 선택에 따라 당사의 플랫폼에서 생성하는 이용자 생성 콘텐츠 및 영상 콘텐츠 등의 정보를 이용하는 경우, 귀하의 동의에 따라 해당 정보에 포함된 귀하의 개인정보가 해당 광고 또는 마케팅 콘텐츠를 제공받는 자에게 공개될 수 있습니다.

맞춤형광고. 당사는 귀하에게 본 플랫폼을 무료로 제공하기 위하여 수시로 당사의 플랫폼에 맞춤형 광고를 게시할 수 있습니다.

정보 보유.  

당사는 귀하가 동의한 수집 목적이 달성되었거나, 귀하가 동의한 이용기간 혹은 본 정책에 명시된 이용기간이 만료된 개인정보를 파기합니다. 단, 당사는 해당하는 경우 다음을 포함하나 이에 국한되지 않는 법정 기간 동안 귀하의 개인정보를 계속 보유합니다.

전자상거래 등에서의 소비자보호에 관한 법률:

광고 및 표시 관련 기록: 6개월

통신비밀보호법:

 귀하의 당사 웹사이트 방문 기록: 3개월

개인정보의 파기.

당사는 관련 부서에서 복구할 수 없는 방식으로 귀하의 개인정보를 파기합니다.

귀하의 권리

정보에 대한 권리.

귀하는 당사가 보유한 귀하의 개인정보에 대한 열람, 부정확한 정보에 대한 정정, 삭제 및 처리중단을 요청할 권리를 보유합니다. 귀하는 홈페이지로 연락하여 귀하의 권리를 행사할 수 있습니다.

정보 보안.

당사는 당사가 보유한 정보에 대한 무단 접근 또는 무단 변경, 무단 공개 또는 파기 등으로부터 Clllap과 이용자를 보호하기 위해 최선의 노력을 다하고 있습니다. 이를 위하여 당사는 기술적, 관리적, 물리적 보호 조치를 시행 중이며, 정보 보호를 위한 내부관리계획 수립, 필요한 인력에 한하여 접근권한 부여, 개인정보 처리시설에 대한 접근 통제 등을 포함하는 기술적•관리적•물리적 조치를 시행하고 있습니다.

아동의 정보.  

Clllap은 만 14세 미만 아동을 대상으로 하지 않습니다.

개인정보의 위탁 및/또는 국외이전.

당사는 경우에 따라 귀하의 동의를 받거나 귀하에게 통지하여 귀하의 정보를 당사의 계열사, 클라우드 서비스 제공사, IT 서비스 제공사 및 데이터 센터에 위탁하며, 수탁사 중 일부는 국외에 소재합니다. 귀하의 정보를 수령하고 처리하는 주체들은 국내외 규정을 준수하여 개인정보를 이용 및 저장하고 개인정보 보호를 위해 가능한 모든 물리적, 기술적 조치를 취할 것을 약속합니다. 귀하에게 본건 서비스를 제공함에 있어 개인정보의 이전이 불필요한 경우, 귀하는 홈페이지로 연락하여 개인정보 이전을 거부할 수 있습니다.`;


const use_string=`일반 규정 – 모든 이용자

 
1. 당사와의 관계

㈜ SparkX. (이하 통칭하여 “스파크엑스” 또는 “당사”)이 제공하는 Clllap (이하 “본 플랫폼”)에 오신 것을 환영합니다.

 

본 약관은 당사 관련 웹사이트, 서비스, 어플리케이션, 제품 및 콘텐츠(이하 통칭하여 “본 서비스”) 이용을 위하여 귀하와 당사의 관계를 규정하는 서비스약관(이하 “본 약관”)입니다. 당사의 본 서비스는 사적이고 비상업적인 목적을 위하여 제공됩니다. 본 약관에서 “귀하”란 귀하와 기타 본 서비스 이용자들을 지칭합니다.

 

본 약관은 귀하와 당사 사이의 법적 효력이 있는 계약입니다. 이하 내용은 충분한 시간을 가지고 주의 깊게 읽어주십시오.

 

미국 이용자들에 대한 중재 통지: 본 약관은 중재 조항 및 당사를 상대로 하는 집단소송 제기권의 포기를 포함하고 있습니다. 위 중재 조항에 언급된 특정 유형의 분쟁을 제외하고, 귀하와 스파크엑스는 양 당사자들간의 분쟁을 강제적이고 구속력 있는 중재로 해결하며, 귀하와 스파크엑스는 집단소송 또는 집단적 중재에 참여할 권리를 포기하는 것에 동의합니다.

 

2. 약관의 동의

본 약관은 귀하가 본 약관에 동의하고 관련 서비스 이용 요청을 전송하여 당사가 해당 요청을 수락하면 효력이 발생합니다. 또한 당사 서비스에 접근하고 이를 이용하는 경우, 당사 커뮤니티 가이드라인 및 커뮤니티 정책을 준수하여야 하며, 이는 본 플랫폼에서 직접 확인하시거나 본 플랫폼을 다운로드할 수 있는 곳, 모바일 기기의 관련 앱 스토어에서 확인하실 수 있으며, 본 약관에도 참조로 포함되어 있습니다.

 

하기 각 관할권의 이용자들에게 해당하는 추가 약관은 귀하가 해당 약관에 동의하여 관련 서비스 이용 요청을 전송하여 당사가 해당 요청을 수락하면 효력이 발생합니다. 귀하가 본 서비스에 접속 또는 이용하는 권할 지역과 관련된 추가 약관 – 관할 지역에 따른 조항과 본 약관의 나머지 규정이 상충하는 경우, 해당 관할 지역의 추가 약관 – 관할 지역에 따른 조항이 우선합니다. 본 약관에 동의하지 않는다면, 당사의 본 서비스에 접속 또는 이를 이용하여서는 안 됩니다. 본 서비스를 이용하는 경우, 귀하는 개인정보처리방침의 규정에 동의하는 것입니다.

 

귀하가 회사 또는 단체를 위하여 본 서비스에 접속 또는 이를 이용하고 있다면, (a) 이하에서 “귀하”는 해당 회사 또는 단체를 포함하고 (b) 귀하는 본 약관에 구속력을 부여할 수 있는 권한을 가지고 있는 자로서, 회사 또는 단체의 수권된 대표자이며, 해당 단체를 대표하여 본 약관에 동의함을 표명하고 보증하며 (c) 귀하의 회사 또는 단체는 법적, 재정적으로 본 서비스의 접속 및 이용을 비롯하여 귀하와 직원, 대리인, 계약자 등 귀하와 관련된 사람들이 귀하의 계정에 접속하거나 이를 사용하는 것에 대하여 책임이 있습니다.

 

귀하는 귀하의 향후의 서비스 접속 및 이용이 약관의 동의로 간주된다는 점에 대하여 이해하며 동의합니다.

 

귀하는 보관을 위하여 본 약관의 복사본을 출력하거나 저장하여야 합니다.

 

3. 약관의 변경

당사는 본 서비스의 기능을 업데이트하는 경우, 당사 혹은 계열회사가 운영하는 여러 앱이나 서비스를 한 개의 종합 서비스나 앱으로 통합하는 경우, 규제가 변경되는 경우 등에 수시로 변경합니다. 당사는 본 약관이 중대하게 변경되는 경우 상업적으로 합리적인 노력을 다하여 본 플랫폼 상의 공지사항 등을 통하여 이러한 변경을 모든 이용자에게 일반적으로 통지할 것입니다. 다만, 귀하는 변경 여부를 확인하기 위하여 본 약관을 주기적으로 보아야 합니다. 당사는 본 약관의 효력 발생일을 기재한 “최신 업데이트” 일자를 본 약관의 상단에 업데이트할 것입니다. 귀하가 약관의 변경 이후에 계속하여 본 서비스에 접속하거나 이를 이용하는 것은 변경된 약관에 대하여 동의하는 것입니다. 당사의 새로운 약관에 동의하지 않는다면, 본 서비스 접속 또는 이용을 중지하시기 바랍니다. 서비스 약관의 이전 버전을 확인하시려면 홈페이지를 방문하시기 바랍니다.

 

4. 계정

본 서비스 중 일부에 접속하거나 이를 이용하기 위하여서는 계정을 생성하여야 합니다. 귀하는 계정 생성 시 정확한 최신의 정보를 제공하여야 합니다. 귀하의 정보를 최신 정보로 완전하게 유지하기 위하여서는, 당사에게 제공한 귀하의 상세정보 및 기타 정보를 관리하고 신속하게 업데이트하는 것이 중요합니다.

 

귀하는 계정 비밀번호를 비밀로 유지하고 이를 제3자에게 공개하여서는 안 됩니다. 제3자가 귀하의 비밀번호를 알고 있거나, 귀하의 계정에 접속한 사실을 알거나 의심하는 경우라면, 즉시 홈페이지를 통해 당사에 알려야 합니다.

 

귀하는 자신의 계정을 통하여 이루어지는 활동에 관하여 (당사와 다른 이용자들에 대하여) 전적으로 책임을 진다는 점에 동의합니다 (단, 스파크엑스의 고의 또는 중과실로 인하여 야기되는 경우는 제외합니다).

 

당사는 귀하가 본 약관을 준수하지 않았다고 판단할 합리적인 사유가 있는 경우 또는 귀하의 계정에서의 활동이 본 서비스에 대한 피해 또는 손상을 발생시키거나, 여하한 제3자의 권리를 침해하였거나, 여하한 관련 법령 또는 규제에 위반하였거나 그러할 가능성이 있다고 판단되는 경우, 귀하의 계정을 사용할 수 없도록 할 권리가 있습니다.

 

귀하가 더 이상 본 서비스를 이용하지 않고 계정 삭제를 원하는 경우, 당사가 이를 처리하여 드릴 수 있습니다. 홈페이지를 통해 당사에 연락하시면, 귀하를 도와 드리고 관련 절차를 안내하여 드리겠습니다. 일단 계정을 삭제하면 귀하는 계정을 재활성화할 수 없으며 귀하가 추가한 콘텐츠 혹은 정보를 불러올 수 없습니다.

 

5. 본 서비스의 접속 및 이용

귀하는 본 약관과 관련 법령 및 규제를 준수하여 본 서비스에 접속하고 이를 이용합니다. 귀하는 다음과 같은 행위를 하여서는 안 됩니다.

 

본 약관의 동의가 가능하지 않거나 이에 동의할 법적 능력이 없음에도 서비스에 접속하거나 이를 이용하는 것

파일, 표, 문서 (또는 그 일부) 등 서비스에 기반한 2차적 저작물을 무단으로 복사, 수정, 각색, 번역, 역설계, 해체, 디컴파일 또는 생성하거나, 본 플랫폼이나 2차적 저작물을 구현하는 소스코드, 알고리즘, 수단 또는 기술을 알아내거나 추출을 시도하는 것;

본 서비스나 그 2차적 저작물의 전부 또는 일부를 배포, 라이선스, 전송 또는 판매하는 것

본 서비스를 유료로 판매, 대여, 또는 리스하거나 본 플랫폼을 광고 또는 상업적 홍보를 위하여 이용하는 것

상업적 광고나 홍보 또는 스팸의 전달 혹은 촉진 등 당사의 명시적 서면 동의 없이 상업적 목적이나 무단으로 서비스를 이용하는 것

본 서비스의 정상적인 작동을 방해하거나 방해를 시도하는 것, 당사의 웹사이트나 본 서비스에 연결된 여하한 네트워크를 방해하는 것, 또는 본 서비스에의 접근을 막거나 제한하는 당사의 모든 조치를 우회하는 것

본 플랫폼이나 그 일부를 다른 프로그램이나 제품에 통합시키는 것. 이 경우, 당사는 재량에 의하여 본 서비스 제공을 거부하거나, 계정을 삭제하거나, 서비스에 대한 접근을 제한할 수 있는 권한이 있습니다.

본 서비스로부터 정보를 수집하기 위하여, 또는 서비스와 상호작용하기 위하여 자동화된 스크립트를 이용하는 것

다른 사람이나 단체를 사칭하거나, 귀하가 업로드, 게시, 전송, 배포하거나 이용 가능하도록 한 콘텐츠가 본 서비스로부터 유래되었다는 인상을 주는 등 귀하에 관하여, 또는 다른 사람이나 단체와 귀하의 관계에 관하여 거짓을 명시하거나 잘못 표시하는 경우

타인을 협박하거나 괴롭히거나, 외설적인 자료, 폭력성 또는 성별, 종교, 국적, 장애, 성적 취향이나 나이에 기반한 차별을 홍보하는 것

스파크엑스의 승인 없이 타인의 계정, 서비스 또는 시스템을 이용하거나 이용을 시도하는 것, 또는 본 서비스 상에서 거짓 신원을 만드는 것

다른 사용자들과 리뷰를 거래하거나, 거짓 리뷰를 작성, 요구하는 등 본 서비스를 통하여 이익의 충돌을 발생시키거나 본 서비스의 목적을 잠식하는 방법으로 이용하는 것

이하에 규정된 대상을 업로드, 전송, 배포, 저장 기타 이용 가능하게 하기 위하여 본 서비스를 이용하는 것

바이러스, 트로이 목마, 웜, 논리 폭탄, 기타 악성 또는 기술적으로 유해한 것을 포함하는 파일

요청되지 않았거나 승인 받지 않은 광고, 권유, 광고성 자료, “정크 메일”, “스팸 메일”, “체인 레터”, “다단계” 또는 기타 허용되지 않는 권유

제3자의 주소, 전화번호, 이메일 주소, 개인 식별 문서(국가 보험 번호, 여권 번호 등)의 번호나 특징 또는 신용카드 번호 등 개인정보

타인의 저작권, 상표권, 또는 기타 지식재산권이나 프라이버시권을 침해하거나 침해할 수 있는 콘텐츠

타인의 명예를 훼손하거나, 음란하거나, 모욕적이거나, 포르노물이거나 혐오스럽거나 선동적인 자료;

형사상의 범죄, 위험한 행위 또는 자해행위를 구성, 장려, 또는 지도하는 자료

의도적으로, 특히 트롤링 및 괴롭힘 등으로 사람들을 자극하거나 적대감을 일으키기 위하여, 또는 괴롭히거나, 위해를 가하거나, 상처를 주거나, 무섭게 하거나, 고통스럽게 하거나, 난처하게 하거나 불편하게 하기 위하여 제작한 자료

물리적 폭력을 내용으로 하는 협박 등 기타 협박을 포함하는 자료

인종, 종교, 나이, 성별, 장애, 또는 성적 취향에 따른 차별 등 인종주의적이거나 차별적인 모든 자료

필요한 정식 라이선스를 받지 않았거나 자격 없이 제공되는 답변, 대응, 코멘트, 의견, 분석 또는 권유

스파크엑스 의 단독 판단에 따라 불쾌하고 부적절한 것, 타인의 본 서비스 이용을 제한하거나 금지하는 것, 또는 스파크엑스의 본 서비스 또는 그 이용자를 여하한 유형의 손해나 책임에 노출시키는 자료

위 내용 이외에도 귀하의 본 서비스 접속 및 이용은 언제든지 커뮤니티 가이드라인에 부합하여야 합니다.

 

당사는 사전 공지 없이 언제든지 당사의 합리적 재량으로 필요하다고 판단하는 경우 콘텐츠를 삭제하거나 콘텐츠로의 접근을 차단할 수 있습니다. 콘텐츠의 삭제 및 접근 차단의 이유에는 콘텐츠가 부적절하거나, 본 약관 또는 커뮤니티 가이드라인을 위반하였거나, 기타 본 서비스 및 본 서비스의 이용자들에게 유해하다고 판단되는 경우 등이 있을 수 있습니다. 당사의 자동화된 시스템은 맞춤화된 검색 결과, 맞춤화된 광고와 같이 귀하에게 개인적으로 관련된 제품 특성을 제공하거나, 스팸 또는 악성코드 감지를 위하여 귀하의 콘텐츠(이메일을 포함합니다)를 분석합니다. 이러한 분석은 콘텐츠가 송신, 수신 및 저장될 때에 이루어집니다.

 

6. 지식재산권

당사는 지식재산권을 존중하며, 귀하도 마찬가지로 이를 존중하여 주실 것을 요청합니다. 귀하는 본 서비스에 접속하고 이를 이용하는 조건으로, 어떠한 지식재산권도 침해하지 않는 방식으로 본 서비스에 접속하고 이를 이용하는 것에 동의합니다. 당사는 사전공지를 하거나 하지 않고, 언제나, 당사의 합리적 재량으로, 저작권 기타 지식재산권을 침해하거나 침해한다는 주장이 있는 계정에 대한 접근을 막는 조치 및/또는 삭제 조치를 할 권리가 있습니다.

 

7. 콘텐츠

A. Clllap 콘텐츠

귀하와 스파크엑스 사이에서, 본 서비스의 모든 콘텐츠, 소프트웨어, 이미지, 문서, 그래픽, 일러스트레이션, 로고, 특허, 상표, 서비스표, 저작권, 사진, 음원, 비디오, 서비스의 음악 및 “보고 느끼는 것(look and feel)”, 그리고 그와 관련된 모든 지식 재산권(이하 “Clllap 콘텐츠”)은 스파크엑스의 소유이거나 스파크엑스에게 라이선스가 있으며, 귀하가 본 서비스를 통해 업로드하거나 전송하는 이용자 콘텐츠(이하에 정의됩니다)는 귀하나 귀하의 라이선서의 소유입니다. 본 약관에서 명시적으로 허용된 것 이외의 목적으로 Clllap 콘텐츠나 본 서비스의 자료를 이용하는 것은 엄격하게 금지됩니다. 위 콘텐츠는 어떠한 목적 하에서도 다운로드, 복사, 재생산, 배포, 전송, 방송, 게시, 판매, 라이선스 또는 기타의 방식으로 당사의, 또는 특정한 경우 당사의 라이선서의 사전 서면 동의가 없는 한 이용될 수 없습니다. 당사 및 당사의 라이선서는 위 콘텐츠에 대하여 명시적으로 부여되지 않은 모든 권리를 보유합니다.

 

귀하는 당사가 (광고, 스폰서, 홍보, 이용 정보 및 기프트(이하에 정의됩니다) 등을 통하는 것을 포함하되 이에 한정되지 아니하는 방법으로) 귀하의 본 서비스 이용으로부터 수익을 창출하거나 영업권을 강화하거나 기타 당사의 가치를 증대할 수 있으며, 본 약관 또는 당사와 체결한 다른 계약에서 당사가 구체적으로 승인한 경우를 제외하고는 여하한 수익, 영업권 또는 가치 등을 당사와 공유할 권리가 없음을 인정하고 이에 동의합니다. 나아가 귀하는 본 약관 또는 당사와 체결한 다른 계약에서 당사가 구체적으로 승인한 경우를 제외하고는 (i) 이용자 콘텐츠(이하에 정의됩니다)를 통하여 또는 귀하가 제작한 이용자 콘텐츠를 포함하여 본 서비스에서 또는 이를 통하여 귀하가 이용할 수 있는 음악 작업, 사운드 레코딩 또는 시청각 클립을 귀하가 사용함으로써 발생하는 여하한 이익이나 기타 대가를 받을 권리가 없으며 (ii) 본 서비스 또는 제3자 서비스상의 이용자 콘텐츠를 현금화하거나 대가를 받을 권리의 행사가 금지된다는 것(예를 들어, 귀하는 유튜브 등 소셜미디어 플랫폼에 업로드된 이용자 콘텐츠에 대하여 현금화를 요구할 수 없습니다)을 인정합니다.

 

본 약관의 규정에 따라, 귀하는 허용된 기기에 본 플랫폼을 다운로드하고 본 서비스를 통하여 본 약관에 따라 귀하의 개인적이고 비상업적인 용도로만 Clllap 콘텐츠를 이용하는 등, 본 서비스 접속 및 이용에 관하여 비독점적이고, 제한적이고, 양도할 수 없고, 서브라이선스를 허여할 수 없으며, 취소 가능한 전세계에서의 라이선스를 보유합니다. 스파크엑스는 본 서비스와 Clllap 콘텐츠에 대하여 본 약관에서 명시적으로 표현되지 않은 모든 권리를 보유합니다. 귀하는 스파크엑스가 위 라이선스를 합리적 재량에 따라 필요하다고 판단하는 경우 종료할 수 있음을 인지하고 동의합니다.

 

본 서비스로부터 또는 본 서비스를 통하여 이용 가능한 사운드 레코딩 및 이에 포함된 음악 작업과 관련하여서는, 어떠한 권리에도 라이선스가 허여되지 않습니다.

 

귀하는 본 서비스를 이용하는 다른 이용자에 의하여 제공된 콘텐츠를 보는 것이 귀하의 리스크 하에서의 행위임을 인지하고 이에 동의합니다. 본 서비스의 콘텐츠는 일반적 정보의 제공만을 위한 것입니다. 본 서비스는 귀하가 의존할 수 있는 조언을 제공하기 위하여 의도된 것이 아닙니다. 귀하는 본 서비스의 콘텐츠에 따른 행동을 하거나 하지 않기 이전에 전문적인 조언을 받아야 합니다.

 

당사는 Clllap 콘텐츠(이용자 콘텐츠도 포함합니다)가 정확하거나, 완전하거나 최신의 것임을 명시적 또는 묵시적으로 진술하거나 보증하지 않습니다. 본 서비스가 다른 사이트 및 제3자가 제공하는 자료에 대한 링크를 포함하고 있는 경우, 이러한 링크는 귀하의 정보를 위하여 제공되는 것입니다. 당사는 위 사이트나 자료에 대하여 관리 권한이 없습니다. 위와 같은 링크는 링크된 웹사이트나 정보를 수집하여도 된다는 당사의 승인으로 해석되어서는 안 됩니다. 귀하는 당사가 귀하 및 본 서비스의 다른 이용자가 게시한 콘텐츠(이용자 콘텐츠를 포함합니다)를 사전적으로 검열하거나, 감시, 검토, 또는 수정할 의무가 없음을 인지합니다.

 

B. 이용자 제작 콘텐츠

본 서비스 이용자는 개인 음악 라이브러리에서 로컬에 저장된 사운드 레코딩과 주변 소음을 결합하는 동영상을 포함하여 모든 텍스트, 사진, 이용자 동영상, 사운드 레코딩, 이에 포함된 음악 작업 등을 포함하나 이에 한정되지 않는 본 서비스를 통하여 이용 가능한 콘텐츠(이하 “이용자 콘텐츠”)를 업로드 하는 것이 허용 됩니다. 본 서비스의 이용자는 스파크엑스가 제공하는 음악, 그래픽, 스티커, 기타 요소들(이하 “Clllap 요소”)을 위 이용자 콘텐츠에 입힐 수 있고, 본 서비스를 통하여 위 이용자 콘텐츠를 전송할 수 있습니다. 스파크엑스 자료가 포함된 이용자 컨텐츠 등 모든 이용자 컨텐츠의 정보와 자료들은 당사에 의하여 증명되거나 승인되지 않았습니다. 본 서비스(가상 기프트의 사용 포함)에 게시되는 다른 이용자들의 자료는 당사의 의견 또는 가치를 대표하는 것이 아닙니다.

 

귀하가 본 서비스를 통하여(인스타그램, 페이스북, 유튜브, 트위터 등 제3자 소셜미디어 플랫폼을 통하는 것을 포함합니다) 이용자 콘텐츠를 업로드하거나 전송하는 기능을 이용하는 경우, 위 “본 서비스의 접속 및 이용” 규정에 명시된 기준을 준수하여야 합니다. 귀하는 Clllap 요소를 포함하는 이용자 콘텐츠 등 귀하의 이용자 콘텐츠를 제3자의 사이트나 플랫폼에 업로드하거나 전송하는 것을 선택할 수 있습니다. 이 때, 귀하는 제3자의 콘텐츠 가이드라인과 위 “본 서비스의 접속 및 이용” 규정의 기준을 준수하여야 합니다.

 

귀하는 이러한 모든 기여가 위 기준에 준수함을 보증하고, 위 보증 사항의 위반 시에 책임을 부담하며 그 손해를 배상하여야 합니다. 이는 귀하의 보증 사항 위반에 의하여 발생한 당사의 모든 손해에 대하여 귀하에게 책임이 있다는 것을 의미합니다.

 

모든 이용자 콘텐츠는 비밀이 아니며, 비전유적인 것으로 간주됩니다. 귀하가 비밀이거나 전유적이라고 생각하는 이용자 콘텐츠는 본 서비스에 또는 이를 통하여 게시하거나 당사에 전송하여서는 안 됩니다. 본 서비스를 통하여 이용자 콘텐츠를 제출하는 경우, 귀하는 해당 이용자 콘텐츠의 소유자이거나, 콘텐츠의 모든 소유자로부터 필요한 모든 승인 및 허가를 받았거나 해당 소유자로부터 권한을 위임 받아 콘텐츠를 본 서비스에 제출하고 본 서비스에서 다른 제3자 플랫폼으로 전송 및/또는 제3자 콘텐츠를 채택하였음을 동의하고 표명합니다.

 

귀하가 사운드 레코딩에 대한 권리만 보유하고 해당 사운드 레코딩에 포함된 기본 음악에 대한 권리는 없는 경우, 귀하가 해당 콘텐츠의 소유자로부터 모든 승인 및 허가를 받았거나 해당 소유자로부터 권한을 위임 받아 콘텐츠를 서비스에 제출하는 경우를 제외하고 귀하는 해당 사운드 레코딩을 본 서비스에 게시하여서는 안 됩니다.

 

당사에게 전송한 이용자 콘텐츠의 저작권은 귀하 또는 귀하의 이용자 콘텐츠의 소유자에게 있으나, 귀하는 본 약관에 동의하여 본 서비스를 통하여 이용자 콘텐츠를 제출함으로써, 모든 형식의 모든 플랫폼에 있는 현재의 또는 이후에 제작될 귀하의 이용자 콘텐츠에 대하여 이용, 수정, 각색, 복제, 2차적 저작물 작성, 출판 및/또는 전송 및/또는 배포할 수 있도록 하는, 또한 본 서비스의 다른 이용자들과 기타 제3자가 위 콘텐츠를 검토, 접근, 이용, 다운로드, 수정, 각색, 복제, 2차적 저작물 작성, 출판 및/또는 전송할 수 있도록 하는 무조건적이고, 취소할 수 없고, 비독점적이고, 로열티가 없으며, 양도 가능하고 영구적인 전세계적 라이선스를 당사에게 제공한다는 점에 동의합니다.

 

나아가 귀하는 당사에게 귀하를 이용자 콘텐츠 원작자로 식별할 수 있는 이용자 이름, 이미지, 음성 및 유사성을 이용하는 로열티가 없는 라이선스를 부여합니다.

 

의심의 여지를 피하기 위하여, 본 조항의 직전 문단에서 설명 드린 권리는 사운드 레코딩을 복제(및 해당 사운드 레코딩에 포함된 음악 작업의 기계적 복제)할 권리, 공개 공연할 권리, 공개 사운드 레코딩(및 이에 포함된 음악 작업)에 소통할 권리를 포함하나 이에 한정되지 않으며, 모두 로열티가 없습니다. 이는 귀하가 사운드 레코딩 저작권 소유자(예: 음반 회사), 음악 작업물 저작권 소유자(예: 음반 출판사), 공연권을 보유한 기구(예: ASCAP, BMI, SESAC 등)(이하 “PRO”), 사운드 레코딩 PRO(예: SoundExchange), 이용자 콘텐츠 제작에 관련된 모든 조합 또는 협회, 엔지니어, 프로듀서 또는 기타 로열티 참여자를 포함하나 이에 한정되지 않는 모든 제3자에게 로열티를 지급할 의무 없이 귀하의 이용자 콘텐츠를 이용할 권리를 당사에게 허여한다는 것을 의미합니다.

 

음악 작업 및 음반 예술가에 대한 특정 규칙. 귀하가 PRO와 관련된 음악 작업의 작곡가 혹은 저작자인 경우, 귀하는 이용자 콘텐츠에서 본 약관을 통하여 귀하가 당사에 허여하는 로열티 없는 라이선스에 관하여 PRO에게 알려주어야 합니다. 귀하는 단독으로 해당 PRO에 대한 통지 의무를 준수할 책임을 집니다. 귀하가 음반 출판사에게 귀하의 권리를 양도한 경우, 귀하의 이용자 콘텐츠에 본 약관에 규정된 로열티 없는 라이선스를 허여하거나 해당 음반 출판사로 하여금 당사와 본 약관을 체결하는 것에 대하여 해당 음반 출판사의 동의를 구하여야 합니다. 귀하가 음악 작업(예: 작사)을 하였다는 것이 귀하가 본 약관의 라이선스를 당사에 허여할 권리를 가진다는 것을 의미하는 것은 아니기 때문입니다. 귀하가 음반 회사와 계약을 체결한 음반 예술가인 경우, 귀하는 본 서비스를 통하여 귀하의 음반 회사가 권리요청을 할 수 있는 새로운 음반을 제작하는 경우를 포함하여, 귀하가 음반 회사에 대하여 부담할 수 있는 계약상 의무에 부합하여 본 서비스를 이용하는 것에 대해 단독으로 책임을 집니다.

 

관중에 대한 권리. 귀하가 이용자 콘텐츠에 부여한 모든 권리는 본 약관에서 관중에 대한 권리를 기반으로 하며, 이는 제3자 서비스의 소유자 혹은 운영자는 본 서비스를 통하여 해당 제3자 서비스에 게시되거나 제3자 서비스에서 사용되는 이용자 콘텐츠에 대하여 귀하 혹은 기타 제3자에게 별도의 책임을 지지 않는다는 것을 의미합니다.

 

이용자 콘텐츠에 대한 권리 포기. 이용자 콘텐츠를 본 서비스에 또는 본 서비스를 통하여 게시함으로써, 귀하는 해당 이용자 콘텐츠와 관련된 마케팅 또는 홍보 자료에 대한 사전 검열 또는 승인에 대한 권리를 포기합니다. 또한 귀하는 귀하의 이용자 콘텐츠 또는 그 일부에 대한 개인정보 및 홍보 관련 권리 또는 기타 유사한 권리의 전부를 포기합니다. 도덕적 권리가 양도 불가능한 범위에서, 귀하는 본 서비스에 또는 본 서비스를 통하여 게시하는 여하한 이용자 콘텐츠에서 또는 이와 관련하여 모든 인격적 권리를 포기하고 귀하가 보유한 여하한 인격적 권리를 기반으로 하는 행동을 지원, 유지, 승인하거나 이를 주장하지 않는다는 것에 동의합니다.

 

당사는 귀하가 본 서비스에 게시하거나 업로드한 이용자 콘텐츠가 제3자의 지식재산권이나 프라이버시권을 침해하였다는 피해 당사자의 주장이 있는 경우, 귀하의 신원을 해당 당사자에게 공개할 권리가 있습니다.

 

당사, 또는 권한 있는 제3자는 재량에 따라 귀하의 콘텐츠를 잘라내거나 편집할 수 있으며, 이를 게시하는 것을 거부할 수 있습니다. 당사는 귀하의 본 서비스상의 포스팅이 위 “본 서비스의 접속 및 이용” 규정상의 콘텐츠 기준을 준수하지 않았다고 판단하는 경우 귀하의 여하한 콘텐츠를 제거, 불허, 차단, 삭제할 권리가 있습니다. 나아가 당사는 단독 재량으로 (i) 본 약관을 위반하였다고 판단되는 이용자 콘텐츠의 경우, 또는 (ii) 다른 이용자나 제3자의 민원에 대한 응대로, 통지 혹은 통지 없이 귀하에 대한 책임을 지지 않고 해당 콘텐츠를 제거, 불허, 차단 또는 삭제할 – 의무가 아닌 – 권리를 가집니다. 이에 따라, 당사는 귀하가 해당 이용자 콘텐츠에 영구적으로 접근하기를 원하는 경우, 본 서비스에 게시하는 이용자 콘텐츠의 사본을 귀하의 개인 기기에 저장할 것을 권장합니다. 당사는 여하한 이용자 콘텐츠의 정확성, 완전성, 적절성 또는 품질을 보장하지 않으며 이용자 콘텐츠에 대하여 어떠한 상황에서도 어떠한 방식으로든 책임을 지지 않습니다.

 

당사는 이용자로부터 제출되어 당사 또는 권한 있는 제3자가 게시한 어떠한 콘텐츠에 대하여서도 책임을 지지 않습니다(단, 스파크엑스의 고의 또는 중과실로 인하여 야기된 경우는 제외합니다).

 

다른 이용자에 의하여 업로드된 정보에 관하여 불만사항이 있는 경우, 홈페이지를 통해 연락하시기 바랍니다.

 

스파크엑스는 권리를 침해하는 자료에 대하여 인지하는 경우, 이를 본 서비스에서 신속히 제거하기 위하여 합리적인 조치를 취합니다. 타인의 저작권이나 지식재산권을 지속적으로 침해하는 본 서비스 이용자들의 계정을 적절한 상황에서 그 재량으로 비활성화하거나 해지하는 것은 스파크엑스의 정책입니다.

 

당사의 직원은 지속적으로 자체 제작 아이디어 및 기능을 개발∙평가하고 있으며, 당사는 이용자 커뮤니티로부터 받는 관심, 피드백, 의견 및 제안에 상당한 주목을 하는 것에 스스로 자부심을 가지고 있습니다. 귀하가 당사 또는 당사의 직원에게 제품, 서비스, 기능, 변경, 향상, 콘텐츠, 개선, 기술, 콘텐츠(청각, 시각, 게임 또는 기타 유형의 콘텐츠 등)의 제공, 홍보, 전략 또는 제품/기능 명칭 또는 관련 문서작업, 삽화, 컴퓨터 코드, 다이어그램 또는 기타 자료(이하 총칭하여 “피드백”)에 대한 아이디어를 송부하는 경우, 귀하의 소통 내용과 상관없이, 향후 오해의 소지를 피하기 위하여 아래 조항이 적용될 것입니다. 따라서 귀하는 당사에 피드백을 송부함으로써 다음 사항에 동의합니다.

 

i. 스파크엑스는 귀하의 피드백을 검토, 고려 또는 시행할 의무가 없으며 어떠한 이유로든 피드백의 전부 또는 일부에 대하여 회신할 의무가 없습니다.

 

ii. 피드백은 비밀로서 제공되지 아니하며, 당사는 귀하가 송부하는 피드백을 비밀로 유지하거나 어떠한 방법으로든 피드백을 이용하거나 공개하는 것을 자제할 의무가 없습니다.

 

iii. 귀하는 피드백 및 그 2차적 저작물과 관련하여, 여하한 목적으로, 제한 없이, 무료로, 그리고 전체 또는 일부인지, 제공된 그대로인지 또는 변경된 상태인지 여부를 불문하고, 피드백에 포함 내지 구현된 상업적 저작물 및 서비스를 제작, 이용, 판매, 청약, 수입 및 홍보하는 등 여하한 유형으로 복제, 배포, 2차적 저작물 작성, 수정, 공연(관중 기반을 포함합니다), 대중과의 소통, 가용화, 공개 전시, 그 밖의 이용 및 활용할 수 있는 계속적이고 무제한적인 승인을 당사에게 취소불능적으로 허여합니다.

 

8. 배상

귀하는 귀하 또는 귀하의 계정(귀하에게 접근권한이 있는 계정)의 이용자가 본 약관, 또는 본 약관에 따른 귀하의 의무, 진술 및 보증사항의 위반으로 인하여 발생한 변호사 수수료와 비용을 포함한 일체의 청구, 책임 및 비용 및 경비로부터 스파크엑스, 그 모회사, 자회사, 계열사 그리고 위 각 회사의 임원, 직원, 대리인 및 자문가를 방어하고 면책시키며 해를 입히지 않을 것에 동의합니다.

 

9. 보증 사항의 제외

본 약관에서 규정하는 사항은 귀하가 계약을 통하여 변경 또는 포기할 수 없는, 소비자에게 반드시 부여되는 법정 권리에는 영향을 미치지 않습니다.

 

본 서비스는 “있는 그대로의 상태”로 제공되며, 당사는 본 서비스에 관하여 귀하에게 진술하거나 보장하지 않습니다. 특히 당사는 귀하에게 이하의 사항을 진술, 보장하지 않습니다.

 

귀하의 본 서비스 이용이 귀하의 요구사항을 충족할 것

귀하의 본 서비스 이용에 방해, 지연, 보안 문제나 에러가 없을 것

귀하가 본 서비스를 이용하여 획득하는 모든 정보가 정확하고 믿을 수 있을 것

귀하에게 본 서비스의 일부로서 제공되는 소프트웨어의 작동 또는 기능의 결함이 수정될 것

조건, 보증 또는 기타 규정(만족스러운 품질, 특정 목적을 위한 적합성, 또는 설명된 사항의 준수와 관련한 모든 묵시적 약관을 포함합니다)은 본 약관에서 명시적으로 표시되지 않은 이상 본 서비스에 적용되지 않습니다. 당사는 사업상, 운영상의 이유로 언제든 공지 없이 본 플랫폼의 일부 또는 전부를 변경, 지연, 철수시키거나 그 이용을 제한할 수 있습니다.

 

10. 책임의 제한

본 약관은 면책되거나 제한하는 것이 법적으로 금지된 당사의 손해배상책임을 면책시키거나 제한하지 않습니다. 사기 또는 사기적 허위 표시에 의한 당사의, 또는 당사 직원, 대리인 또는 수급사업자들의 과실에 의한 사망과 상해에 대한 책임에 대하여서도 마찬가지입니다.

 

위 내용을 전제로, 당사는 귀하에 대하여 이하의 책임을 지지 않습니다.

 

(I) 모든 영업상 수익의 손실(직접적 또는 간접적으로 발생한 손실을 포함합니다), (II) 모든 영업권의 손실, (III) 모든 기회의 손실, (IV) 귀하가 입은 모든 데이터의 손실, 또는 (V) 귀하에 의하여 발생한 모든 간접적, 또는 결과적인 손실. 그 밖의 모든 손실에 대한 보상은 귀하가 스파크엑스에 대하여 최근 12개원동안 지불한 범위 내로 제한됩니다.

이하의 상황에서 귀하로 인하여 발생한 모든 손실 또는 피해

광고의 완전성, 정확성 또는 존재에 대한 귀하의 신뢰, 또는 귀하와 본 서비스에 표시되는 광고의 광고주 또는 스폰서와의 관계나 거래의 결과로 생기는 귀하의 신뢰

당사가 본 서비스에 대하여 행한 모든 변경, 또는 영구적이거나 일시적인 서비스(또는 서비스 내의 기능)의 제공 중단

귀하의 본 서비스 이용에 의하여, 또는 이를 통하여 보존되거나 전송되는 모든 콘텐츠와 기타 통신 정보의 삭제, 변질, 저장 실패

귀하가 당사에게 정확한 계정정보를 주지 못함

귀하가 귀하의 비밀번호나 계정 정보의 보안유지 및 비밀유지에 실패함

당사는 본 플랫폼을 가정용의, 사적인 이용을 위하여만 제공한다는 점을 유의하십시오. 귀하는 본 플랫폼을 상업적으로 또는 사업 목적으로 사용하지 않을 것에 동의하며, 당사는 귀하의 어떠한 영업상 이익의 손실, 사업상 손실, 영업권 또는 사업평판의 손실, 업무방해 또는 사업 기회의 손실에 대해서도 책임을 지지 않습니다.

 

당사가 하자가 있는 디지털 콘텐츠를 귀하에게 제공하여 귀하의 기기나 디지털 콘텐츠에 피해가 발생하였고, 위 피해가 합리적인 관리와 기술적 조치의 부족으로 발생한 것이라면, 당사는 귀하에게 해당 피해를 복구하거나 보상할 것입니다. 그러나 귀하가 무료로 제공되는 업데이트를 행하라는 당사의 조언을 따랐더라면 입지 않았을 피해나, 귀하가 설치 설명서를 정확하게 따르지 않거나 당사가 제공하는 최소한의 시스템요구사항을 지키지 못하여 발생한 손해에 대해서는 책임지지 않습니다.

 

위와 같은 면책 사항은 당사가 해당 손실이 발생할 수 있다는 점에 대하여 조언을 받은 바 있거나 그 가능성에 대하여 인지하고 있었어야 했는지 여부와 무관하게 적용됩니다.

 

귀하는 당사의 서비스를 이용함에 있어 부과될 수 있는 문자메세지 요금과 데이터요금을 포함한 모든 휴대전화 요금에 대하여 책임이 있습니다. 어떠한 요금이 적용되는지에 관하여 확실하지 않은 경우에는 본 서비스를 이용하기 전에 귀하의 휴대전화 서비스 사업자에게 문의하여야 합니다.

 

법령이 허용하는 최대 범위에서, 귀하의 본 서비스 이용으로 발생하는 제3자와의 분쟁(예를 들어 여하한 통신사, 저작권 소유자 또는 다른 이용자 등과의 분쟁을 포함하되 이에 한정되니 아니함)은 귀하와 해당 제3자 사이에 직접 존재하는 것이며, 귀하는 해당 분쟁으로부터 또는 이와 관련하여 발생하는 알려졌거나 알려지지 않은 모든 종류와 성질의 청구, 요구 및 손해(실제 손해 및 결과적 손해)로부터 당사 및 당사의 계열회사를 취소불능적으로 면책합니다.

 

11. 기타

a. 관련 법률 및 관할 국가. 추가 약관 – 관할 지역에 따른 조항에 따라, 본 약관 및 본 약관의 주된 내용 및 그 성립은 싱가포르 법률에 의해 규율됩니다. 본 약관의 존재, 유효성 또는 종료에 관한 질문을 포함하여 본 약관으로부터 또는 이와 관련하여 발생하는 분쟁은  싱가포르국제중재센터(Singapore International Arbitration Centre, 이하 “SIAC”)의 중재 절차에 회부되어 당시 유효한 싱가포르국제중재센터의 중재규칙(Arbitration Rules of the Singapore International Arbitration Centre, 이하 “SIAC 규칙”)에 따라 최종적으로 해결되며, 동 규칙은 본 조항에 언급됨으로써 통합되는 것으로 간주됩니다. 중재지는 싱가포르로 합니다. 재판부는 3인의 중재인으로 구성됩니다. 중재 언어는 영어로 합니다.

 

b. 오픈 소스. 본 플랫폼은 특정 오픈 소스 소프트웨어를 포함 합니다. 각 오픈 소스 소프트웨어 아이템은 해당 라이선스 조항에 의해 규율되며 그 내용은 오픈소스 정책에서 확인하실 수 있습니다.

 

c. 완전 합의. 본 약관(하기 추가 약관 포함)은 귀하와 스파크엑스 사이의 완전한 법적 합의로서, 귀하의 본 서비스 이용을 규율하며, 본 서비스에 관하여 귀하와 스파크엑스 사이에 있었던 모든 기존의 합의를 대체합니다.

 

d. 링크. 귀하는 정당하고 법적인 방법으로, 당사의 평판을 손상시키거나 그로 인하여 이익을 취하지 않는 방식으로 당사의 홈페이지를 링크할 수 있습니다. 귀하는 당사의 제휴, 승인 또는 보증이 없음에도 불구하고 이를 시사하기 위한 수단으로 링크를 만들 수 없습니다. 귀하는 귀하가 소유하지 않는 웹사이트에 당사의 플랫폼 링크를 만들어서는 안 됩니다. 귀하가 링크를 만드는 웹사이트는 위의 “본 서비스의 접근 및 이용” 규정의 콘텐츠 기준을 모두 준수하여야 합니다. 당사는 사전 공지 없이 링크에 대한 승인을 철회할 권리가 있습니다.

 

e. 연령 제한. 본 서비스는 만 14세 이상의 사람들만을 대상으로 합니다 (추가 약관 – 관할 지역에 따른 조항에 규정된 추가 제한 사항을 포함합니다). 귀하는 본 서비스를 이용함으로써 귀하가 관련 기준 연령 이상임을 확인합니다. 만약 당사가 위 기준 연령 미만의 자가 본 서비스를 이용하고 있다는 것을 알게 된 경우, 당사는 해당 이용자의 계정을 해지할 것입니다.

 

f. 권리포기 금지. 당사가 본 약관의 조항을 이행하지 않거나 집행하지 않는 것은 해당 조항이나 권리를 포기하는 것으로 해석되지 않습니다.

 

g. 보안. 당사는 본 서비스의 보안상태나 본 서비스가 버그나 바이러스부터 안전하다는 점에 대하여 보증하지 않습니다. 귀하는 본 서비스에 접속할 때에 귀하의 정보 기술, 컴퓨터 프로그램과 플랫폼의 환경설정을 할 책임이 있습니다. 귀하는 귀하의 바이러스 보호 소프트웨어를 이용하여야 합니다.

 

h. 가분성. 관련 사안에 관하여 관할을 가지는 법원이나 법률에 따라 본 약관의 특정 조항이 무효가 되는 경우, 해당 조항은 본 약관에서 삭제되고 이는 기타 다른 조항들에 영향을 미치지 않으며, 삭제된 조항 이외의 약관 조항들은 여전히 유효하고 집행 가능합니다.

 

i. 질문 있나요?. 기타 문의 사항은 홈페이지를 통해 연락하시기 바랍니다.

 

추가 약관 – 앱스토어

관련 법령이 허용하는 범위 내에서, 특정 기기를 통하여 본 플랫폼에 접속하는 경우 이하의 추가 약관이 적용됩니다.

 

애플 관련 통지. 귀하가 애플 주식회사(이하 “애플”)가 제조한 기기에서 본 플랫폼을 다운로드할 때에는 이하의 사항에 대하여 인지하며 동의합니다.

 

본 약관은 스파크엑스와 귀하 사이에 적용되는 것입니다. 애플은 본 약관의 당사자가 아닙니다.

이하에서 귀하에게 주어지는 라이선스는 애플 기기 중 애플로부터 승인 받은 것으로서 애플의 앱스토어 이용약관에 규정된 이용 규칙을 준수하여 개인적·비상업적 이용 목적으로 소유하거나 관리하는 기기에 본 플랫폼을 설치할 수 있는 개인적, 제한적, 비독점적, 양도 불가능한 권리입니다.

애플은 본 플랫폼이나 본 플랫폼의 콘텐츠에 대하여 책임을 지지 않으며, 본 플랫폼과 관련된 지원 서비스를 제공하거나 유지할 의무가 없습니다.

본 플랫폼이 보증된 바에 부합하지 못하는 경우, 귀하는 애플에 이를 통지할 수 있으며, 애플은 본 플랫폼 구매가격이 있는 경우 구매가격 상당을 환불해줄 것입니다. 법령이 허용하는 최대 한도 내에서, 애플은 본 플랫폼과 관련하여 어떠한 다른 보증 의무도 지지 않습니다.

애플은 본 플랫폼이나 귀하의 본 플랫폼 소유 및 이용과 관련한 귀하나 제3자의 청구에 대하여 일체의 책임이 없습니다. 애플에게 책임이 없는 청구에는 (a) 제조물 책임 청구, (b) 본 플랫폼이 관련 법령 또는 규제의 요구사항을 준수하지 못하였다는 주장, (c) 소비자보호법이나 기타 유사한 법률에 의거한 청구를 포함하되 이에 한정되지 아니합니다.

제3자가 본 플랫폼, 또는 귀하의 본 플랫폼 소유 및 이용이 자신의 지식재산권을 침해한다고 주장하는 경우, 애플은 지식재산권 침해 주장을 조사, 방어, 해결 혹은 관련 채무를 변제할 책임이 없습니다.

귀하는 귀하가 (a) 미국 정부의 엠바고 정책이 적용되는 나라, 또는 미국 정부로부터 “테러 지원국”으로 지정된 나라에 있지 않다는 점, (b) 귀하가 미국 정부로부터 금지되거나 제한된 단체에 가입되어 있지 않다는 점을 표명하고 보증합니다.

애플과 애플의 자회사는 본 약관의 수익자이며, 귀하가 본 약관의 규정 및 조건에 대해 동의함으로써, 애플은 수익자로써 본 약관을 귀하에 대해 적용할 권리가 있습니다(또한 애플이 위 권리에 동의한 것으로 인정됩니다).

스파크엑스는 가족 공유 기능 또는 애플의 기타 유사한 기능을 통하여 여러 이용자가 본 플랫폼을 함께 사용하는 것을 명시적으로 승인합니다.

윈도우 폰 스토어. 귀하는 마이크로소프트 주식회사 또는 그의 계열사가 운영하는 윈도우 폰 스토어(또는 그 승계인)에서 본 플랫폼을 다운로드 받음으로써 이하의 사항에 대하여 인지하며 동의합니다.

 

귀하는 귀하가 윈도우 폰 스토어에 접속하기 위하여 이용하는 마이크로소프트 계정과 연결된 최대 다섯(5)개의 윈도우 폰 기기에 하나의 본 플랫폼을 설치하고 이용할 수 있습니다. 그 이상의 경우에는, 당사는 그 밖에 추가적인 조건을 적용하거나 추가 요금을 부과할 권리가 있습니다.

귀하는 마이크로소프트 주식회사, 귀하의 휴대전화 제조사 및 네트워크 운영자에게 본 플랫폼과 관련된 지원 서비스를 제공하거나 유지할 의무가 없음을 인지합니다.

아마존 앱스토어. 귀하는 아마존 디지털 서비스 주식회사 또는 그 계열사(이하 “아마존”)가 운영하는 아마존 앱스토어(또는 그 승계인)에서 본 플랫폼을 다운로드 받음으로써 이하의 사항에 대하여 인지하며 동의합니다.

 

(a) 아마존 앱스토어 이용약관 또는 아마존 앱스토어를 위한 기본 최종이용자 라이선스 약관 중 아마존이 지정한 것("아마존 앱스토어 EULA 약관")과 (b) 본 약관의 다른 조항 및 조건이 상충하는 경우, 귀하가 아마존 앱스토어로부터 다운로드 받은 본 플랫폼의 이용에 있어 아마존 앱스토어 EULA 약관이 우선합니다.

아마존은 스파크엑스나 귀하(또는 여하한 다른 이용자)의 본 약관이나 아마존 앱스토어 EULA 약관의 준수 또는 위반과 관련하여 책임을 지지 않습니다.

구글 플레이. 귀하는 구글 주식회사 또는 그 계열사(이하 “구글”)가 운영하는 구글플레이(또는 그 승계인)에서 본 플랫폼을 다운로드 받음으로써, 이하의 사항에 대하여 인지하며 동의합니다.

 

(a) 구글플레이 이용약관, 구글플레이 비즈니스 및 프로그램 정책 또는 구글플레이를 위한 기본 최종이용자 라이선스 약관 중 구글이 지정한 것(이하 총칭하여 “구글플레이 약관” 과 (b) 본 약관의 다른 조항 및 조건이 상충하는 경우, 귀하가 구글플레이로부터 다운로드 받은 본 플랫폼의 이용에 있어 구글플레이 약관이 우선합니다.

귀하는 구글이 스파크엑스나 귀하(또는 여하한 다른 이용자)의 본 약관이나 구글플레이 약관의 준수 또는 위반과 관련하여 책임이 없음을 인지합니다.

추가 약관 – 관할 지역에 따른 조항

대한민국. 귀하가 대한민국에서 당사의 서비스를 이용하는 경우, 이하의 추가 약관이 적용됩니다.

 

적용 법률 및 관할. 본 약관, 본 약관에 따른 사안 및 본 약관의 제정은 대한민국 법률에 따릅니다. 귀하와 당사는 모두 대한민국 법원이 전속 관할을 갖는 것에 동의합니다.

책임의 제한. 제4조 및 제10조의 책임의 제한 조항은 당사의 고의 또는 과실에 의하여 귀하에게 발생한 손실 및 피해에 관하여는 적용되지 않습니다.

부모 및 보호자 동의. 귀하가 만 14세 이상 19세 미만인 경우, 귀하는 부모 또는 보호자로부터 서비스를 이용하거나 서비스에 계정을 가입하는 것에 대하여 동의를 받았음을 보증합니다.

약관의 변경. 이하의 내용은 제3조의 규정에 우선하여 적용됩니다.

당사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.

당사가 본 약관을 변경할 경우에는 적용일자 및 수정사유를 명시하여 현행약관과 함께 홈페이지의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 그러나 본 약관의 중대한 변경 또는 이용자에게 불리한 변경이 있는 경우, 당사는 합리적 노력을 다하여 이용자에게 사전통지를 제공할 것이며, 변경된 약관은 최소한 30일 이후에 시행됩니다. 단, 귀하의 편의를 향상하는 서비스의 새로운 기능에 관한 변경이나 법적인 사유로 인한 변경은 즉시 시행될 수 있습니다.

위와 같이 변경된 약관을 공지 또는 통지하면서, 귀하에게 위 기간 내에 의사 표시를 하지 않으면 의사표시가 표명된 것으로 본다는 뜻을 명확하게 공지 하거나 통지하였음에도 귀하가 명시적으로 거부의 의사표시를 하지 아니한 경우 변경 약관에 동의한 것으로 봅니다.

본 서비스의 이용. 이하의 내용은 제5조의 규정에 우선하여 적용됩니다.

콘텐츠가 불쾌 또는 부적절하거나, 본 약관을 위반하였거나, 기타 서비스 및 서비스 이용자에게 유해하다고 생각되는 경우가 아닌 한, 귀하의 동의나 법적 근거 없이 이용자 콘텐츠를 삭제하거나 해당 콘텐츠에의 접근을 막지 않을 것입니다.

이용자 제작 콘텐츠. 이하의 내용은 제7조 B의 규정에 우선하여 적용됩니다.

당사는 법률에서 허용되는 범위 내에서 귀하와 다른 이용자들에게 본 서비스를 제공하고 본 플랫폼 홍보 및 개선을 위한 목적으로 당사의 라이선스에 따라 이용자 콘텐츠를 이용, 수정, 각색, 복제, 2차적 저작물 작성, 출판 및/또는 전송, 본 서비스의 다른 이용자들과 기타 제3자가 위 콘텐츠를 이용, 수정, 각색, 복제, 2차적 저작물 작성, 출판 및/또는 전송할 수 있도록 할 수 있습니다.

당사는 법률상 특별히 허용되거나 귀하의 동의가 있는 경우가 아닌 한, 귀하의 신원을 어떠한 제3자에게도 공개하지 않습니다.

귀하의 이용자 콘텐츠가 위 “본 서비스 접근 및 이용” 규정에 명시된 기준을 준수하지 않았다고 판단되는 경우, 당사 혹은 권한 있는 제3자는 해당 이용자 콘텐츠를 잘라내거나 편집할 수 있으며, 이를 게시하는 것을 거부할 수 있습니다.

서비스 이용제한 등에 관한 사전 통지. 이하의 내용은 제5조, 제6조, 제7조, 제9조의 규정에 우선하여 적용됩니다.

당사는 귀하에게 불리한 변경을 가하는 경우(본 서비스에 대한 모든 지연 또는 이용의 제한, 계정의 해지 및 삭제, 콘텐츠의 제거, 불허, 차단을 모두 포함합니다),  해당 조치의 이유를 지체없이 통지할 것입니다. 다만, 통지가 법적 이유로 금지되거나 이용자, 제3자, 당사 및 그 계열사에 위해를 야기할 수 있다고 합리적으로 판단되는 경우(예를 들어, 통지하는 것이 법령 또는 규제당국의 명령을 위반하는 경우, 조사를 방해하는 경우, 본 서비스의 보안을 해하는 경우 등)에는 통지를 하지 않을 수 있습니다.

 

약관의 동의. 이하의 내용은 제2조의 규정에 우선하여 적용됩니다.

귀하가 본 약관에 동의하여도 개인정보처리방침 동의는 의제되지 않으며, 귀하는 본 약관에 대한 동의와는 별도로 개인정보처리방침에 동의하셔야 합니다.`;

export default [privacy_string,use_string] ;