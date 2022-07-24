
package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.kakao.kakaolink.v2.KakaoLinkService;
import com.kakao.kakaolink.v2.KakaoLinkResponse;
import com.kakao.message.template.FeedTemplate;
import com.kakao.message.template.LinkObject;
import com.kakao.message.template.ButtonObject;
import com.kakao.message.template.SocialObject;
import com.kakao.message.template.ContentObject;
import com.kakao.message.template.TemplateParams;

import com.kakao.network.callback.ResponseCallback;
import com.kakao.network.ErrorResult;

import java.util.Map;
import java.util.HashMap;

//import com.kakao.sdk.common.util.Utility;

public class RNKakaoTestModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNKakaoTestModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNKakaoTest"; 
  }

  /*@ReactMethod
  public String getKey(){
    return Utility.getKeyHash(this);
  }*/

 @ReactMethod
  public void link(final Callback successCallback) {

              TemplateParams params = FeedTemplate
                .newBuilder(ContentObject.newBuilder("Kakaotalk share sns","http://mud-kage.kakao.co.kr/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
                        LinkObject.newBuilder()
                                .setWebUrl("https://tree9odic.tistory.com/59")
                                .setMobileWebUrl("https://tree9odic.tistory.com/59")
                                .build())
                        .setDescrption("카카오 피드 메세지 템플릿.")
                        .build())

                .setSocial(SocialObject.newBuilder()
                        .setLikeCount(0)
                        .setCommentCount(0)
                        .setSharedCount(0)
                        .setViewCount(0)
                        .setSubscriberCount(0)
                        .build())  //소셜 카운트

                .addButton(new ButtonObject("자세히보기", LinkObject.newBuilder()
                        .setWebUrl("https://tree9odic.tistory.com/59")
                        .setMobileWebUrl("https://tree9odic.tistory.com/59").build()))

                /*.addButton(new ButtonObject("앱에서 보기", LinkObject.newBuilder()
                        //.setWebUrl("https://www.daum.net")
                        //.setMobileWebUrl("https://www.daum.net")
                        .setAndroidExecutionParams("key1=value1")
                        .setIosExecutionParams("key1=value1")
                        .build()))*/
                .build();

      Map<String, String> serverCallbackArgs = new HashMap<String, String>();
        serverCallbackArgs.put("user_id", "${current_user_id}");
        serverCallbackArgs.put("product_id", "${shared_product_id}");

        String url="https://teamspark.kr/share";

      KakaoLinkService.getInstance().
          sendDefault(this.getCurrentActivity(),
                      params, /*serverCallbackArgs,*/ new ResponseCallback<KakaoLinkResponse>() {
                          @Override
                          public void onFailure(ErrorResult errorResult) {
                            // Log.e("KAKAO API","카카오링크공유실패"+errorResult);
                            successCallback.invoke(errorResult.toString());
                          }

                          @Override
                          public void onSuccess(KakaoLinkResponse result) {
                              successCallback.invoke(result);
                          }
                      });

       /*KakaoLinkService.getInstance()
       .sendScrap(this.getCurrentActivity(),url,null,new ResponseCallback<KakaoLinkResponse>(){
         @Override
         public void onFailure(ErrorResult errorResult){
           successCallback.invoke(errorResult.toString());
         }
         @Override
         public void onSuccess(KakaoLinkResponse result){
           successCallback.invoke(result);
         }
       });*/             

 }
}