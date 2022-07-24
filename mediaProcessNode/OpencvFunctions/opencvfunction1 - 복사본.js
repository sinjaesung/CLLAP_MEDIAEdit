//필터이펙트 처리관련..여기에 opencv.js or opencv.wasm관련 opencv 전역함수 함수형태의 이펙트적용 format함수들 추가해주시면 될것같습니다.
//넘어오는 src가 cv.matrix여야만 처리가능>>

//const {cv, cvTranslateEror} = require('opencv-wasm');
console.log('함수실행!!!:opencvFucntionsss===============================');

//==========OPENCV IN NODEJS INITALIZE =====================================================>>>>
const {Canvas,createCanvas,Image,ImageData,loadImage } =require('canvas');
const {JSDOM} = require('jsdom');
const {writeFileSync,existsSync,mkdirSync} = require('fs');

(async () => {
    installDOM();

    await loadOpenCV();

    try{
      
        
       /*let dstc4=new cv.Mat(target_src.rows,target_src.cols,cv.CV_8UC4);
       let kernelSize = 6;
       let kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);
       let color = new cv.Scalar();
       cv.dilate(target_src, dstc4, kernel, {x: -1, y: -1}, 1, Number(cv.BORDER_CONSTANT), color);

       console.log(target_src,dstc4);
       kernel.delete();target_src.delete();

       let writecanvas = createCanvas(dstc4.cols,dstc4.rows);
       cv.imshow(writecanvas,dstc4);
       writeFileSync(`wanansanan.png`,writecanvas.toBuffer('image/png'));

       let dstc1=new cv.Mat();
        cv.cvtColor(src,dstc1,cv.COLOR_RGBA2GRAY);
        //cv.canny(dst1,dst2,5,threshold1,threhsold2,)
        cv.Canny(dstc1,dstc1,26,114,5,0);
        cv.cvtColor(dstc1,dstc1,cv.COLOR_GRAY2BGRA);

       let src_overlay=new cv.Mat();
        //let src_overlayimage= await Jimp.read(`${overlay_referval}${overlay_index+1}.png`);//오버레이 해당 범위 1~52범위 테이크별 관련 대상체를 remote읽는다.
        let src_overlayimage = await loadImage(`../resource/fireworks/Fireworks16_frame99.png`);//오버레이 해당 이미지 관련하여 읽는다.                  
        //src_overlay = cv.matFromImageData(src_overlayimage.bitmap);//오버레이 대상 이미지의 metrix데이터입니다.
        src_overlay = cv.imread(src_overlayimage);//new cv.mat 메트릭스 형태 반환 오버레이매트릭스*/

        //console.log('::original_frame_source',original_frame_source.bitmap)
        //console.log(':::src_overlayimage:',src_overlayimage.bitmap);

        /*let overlay_dst= new cv.Mat();

        cv.addWeighted(dstc1,1,src_overlay,0.72,0.0,overlay_dst,-1);//overlay_dst에 관련 메트릭스 효과 반영되며 이를 파일로 저장필요. 한개 오버레이이펙트효과,필터효과 중첩반영된것임.
        //1,2,3,4,5........중첩된 것들에 대해선 이미 동일파일명으로 덮어씌워질것이기에.앞에서 이미 insert되었다고할수있다.

        let writecanvas= createCanvas(overlay_dst.cols,overlay_dst.rows);
        cv.imshow(writecanvas,overlay_dst);
        writeFileSync('RRRRRRRR.png',writecanvas.toBuffer('image/png'));

       return overlay_dst;  */     
    }catch(error){
        //console.log('what opencv werorrrs:',error);
    }
    
})();
function loadOpenCV(){
    console.log('===loadOpenvcv-===호출::::');
    return new Promise(resolve => {
        global.Module={
            onRuntimeInitialized: resolve
        };
        global.cv = require('../resource/opencv.js');
    });
}
function installDOM(){
    const dom=new JSDOM();
    global.document= dom.window.document;

    global.Image = Image;
    global.HTMLCanvasElement = Canvas;
    global.ImageData = ImageData;
    global.HTMLImageElement = Image;
}

// //=========================================================================================================>>>
let contoursColor = [];
for (let i = 0; i < 10000; i++) {
    contoursColor.push([Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255), 0]);
}
const opencvfunction= {

    passThrough: function passThrough(src) {
        //console.log('passThroughtss src:',src);//target_src를 바로 받아서 이를 바로 리턴하고 외부에서 처리후에 target_src해제하는 형태로.
        return src;
    },
    //gray 모드 출력>>cv.Color_rgba2gray
    gray : function gray(src) {
        //console.log(' gray 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);//채널한개짜리 mat공간을 생성을 바로 한후에 외부에 전달한다, 외부에서 이를 해제하는형태로 한다. 외부에서 건내준target_src,전달 dstc1메모리해제해준다.
        //cv.cvtColor(src, dstC1, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(src, dstc1, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(dstc1,dstc1,cv.COLOR_GRAY2RGBA);

        src.delete();//target_src넘겨준것은 원본관련하여 처리후에 삭제하고->처리후에 return개체는 밖에서 받아서 처리후 삭제한다.
        return dstc1;
    },
    //hsv변환관련 출력>>cv.color_rgba2rgb, cv.color_rgb2hsv
    hsv: function hsv(src) {
        //console.log(' hsv 호출>>>>',src.rows,src.cols);
        //let dstC3=new cv.Mat(src.rows,src.cols,cv.CV_8UC3);
        let dstC3=new cv.Mat();
        //console.log('dsts333:',dstC3);
        //console.log('srcc원본:',src);
        cv.cvtColor(src, dstC3, cv.COLOR_RGBA2RGB);
        cv.cvtColor(dstC3, dstC3, cv.COLOR_RGB2HSV);
        //cv.cvtColor(src,dstc3,cv.COLOR_RGBA2RGB);
        //cv.cvtColor(dstc3,dstc3,cv.COLOR_RGB2HSV);

        src.delete();
        //return dstC3;
        return dstC3;//외부에서 dstc3지역변수개체mat메모리해제, 외부전달target_src바로해제
    },
    //케니변환 임계값 최소최대였던가 
    canny : function canny(src) {
        //console.log(' canny 호출>>>>',src.rows,src.cols);
        //let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        let dstc1=new cv.Mat();
        cv.cvtColor(src,dstc1,cv.COLOR_RGBA2GRAY);
        //cv.canny(dst1,dst2,5,threshold1,threhsold2,)
        cv.Canny(dstc1,dstc1,26,114,5,0);
        cv.cvtColor(dstc1,dstc1,cv.COLOR_GRAY2RGBA)
        //cv.cvtColor(src, dstC1, cv.COLOR_RGBA2GRAY);
        /*cv.Canny(dstC1, dstC1, controls.cannyThreshold1, controls.cannyThreshold2,
                    controls.cannyApertureSize, controls.cannyL2Gradient);*/
        //return dstC1;
        src.delete();

        return dstc1;
    },
    //범위출력>>
    inRange : function inRange(src) {
        //console.log(' inRange 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        //console.log('hmm src target targetsrc mat width,height image pixelss',src.cols,src.rows);
        let lowValue = 98;
        let lowScalar = new cv.Scalar(lowValue, lowValue, lowValue, 255);
        let highValue = 201;
        let highScalar = new cv.Scalar(highValue, highValue, highValue, 255);
        //let low = new cv.Mat(height, width, src.type(), lowScalar);
        //let high = new cv.Mat(height, width, src.type(), highScalar);
        let low = new cv.Mat(src.rows,src.cols,src.type(), lowScalar);
        let high = new cv.Mat(src.rows,src.cols,src.type(), highScalar);
        //console.log('inRange test:',src.type(),lowScalar,dstc1);
        cv.inRange(src, low, high, dstc1);
        low.delete(); high.delete();src.delete();
        return dstc1;//dstc1해제하고, 외부전달준 targetsrc외부에서 해제.
    },
    //임계점
    threshold : function threshold(src) {
        //console.log(' threshold 호출>>>>',src.rows,src.cols);
        let dstc4= new cv.Mat(src.rows,src.cols,cv.CV_8UC4);//채널4개짜리mat매트릭스 생성 메모리공간 생성.
        cv.threshold(src, dstc4, 140, 200, cv.THRESH_BINARY);
        src.delete();
        return dstc4;
    },
    //적응형 임계점api
    adaptiveThreshold : function adaptiveThreshold(src) {
        //console.log(' adaptiveThreshold 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        //console.log('targetsrc rows,height width,height??:',src.cols,src.rows);
        //let mat = new cv.Mat(height, width, cv.CV_8U);
        let mat =new cv.Mat(src.rows,src.cols,cv.CV_8U);
        cv.cvtColor(src, mat, cv.COLOR_RGBA2GRAY);
        cv.adaptiveThreshold(mat, dstc1, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C,
                                cv.THRESH_BINARY, Number(45), 2);
        mat.delete();src.delete();
        return dstc1;
    },
    //가우시안블러
    gaussianBlur: function gaussianBlur(src) {
       // console.log(' gaussianBlur 호출>>>>',src.rows,src.cols);
        let dstc4=new cv.Mat(src.rows,src.cols,cv.CV_8UC4);
        cv.GaussianBlur(src, dstc4,
                        {width: 11, height: 11},
                        0, 0, cv.BORDER_DEFAULT);
        src.delete();
        return dstc4;
    },

    //바이레탈필터블러(ui미노출)
    bilateralFilter : function bilateralFilter(src) {
        let dstc3=new cv.Mat(src.rows,src.cols,cv.CV_8UC3);
        let mat = new cv.Mat(src.rows, src.cols, cv.CV_8UC3);
        cv.cvtColor(src, mat, cv.COLOR_RGBA2RGB);
        cv.bilateralFilter(mat, dstc3, controls.bilateralFilterDiameter, controls.bilateralFilterSigma,
                            controls.bilateralFilterSigma, cv.BORDER_DEFAULT);
        mat.delete();src.delete();
        return dstc3;
    },
    //연산정도가 큰편.(ui미노출)
    medianBlur : function medianBlur(src) {
        let dstc4=new cv.Mat(src.rows,src.cols,cv.CV_8UC4);
        cv.medianBlur(src, dstc4, controls.medianBlurSize);
        src.delete();
        return dstc4;
    },
    //소벨함수
    sobel : function sobel(src) {
        //console.log(' sobel 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        //console.log('sobel filter functions targersrcsss width,heights:',src.cols,src.rows);
        //let mat = new cv.Mat(height, width, cv.CV_8UC1);
        let mat = new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        cv.cvtColor(src, mat, cv.COLOR_RGB2GRAY, 0);
        cv.Sobel(mat, dstc1, cv.CV_8U, 1, 0,9, 1, 0, cv.BORDER_DEFAULT);
        mat.delete();src.delete();
        return dstc1;
    },
    scharr : function scharr(src) {
        //console.log(' scharr 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        //console.log('scharrr exeuctess functions targetsrc width,heightss:',src.cols,src.rows);
        //let mat = new cv.Mat(height, width, cv.CV_8UC1);
        let mat =new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        cv.cvtColor(src, mat, cv.COLOR_RGB2GRAY, 0);
        cv.Scharr(mat, dstc1, cv.CV_8U, 1, 0, 1, 0, cv.BORDER_DEFAULT);
        mat.delete();src.delete();
        return dstc1;
    },
    laplcaican: function laplacian(src) {
        //console.log(' laplacian 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        //console.log('laplcaisin exeuctes functions targetsrc rowss,width,height:',src.cols,src.rows);
        //let mat = new cv.Mat(height, width, cv.CV_8UC1);
        let mat =new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        cv.cvtColor(src, mat, cv.COLOR_RGB2GRAY);
        cv.Laplacian(mat, dstc1, cv.CV_8U, 6, 1, 0, cv.BORDER_DEFAULT);
        mat.delete();src.delete();
        return dstc1;
    },
      
    //contours
    contours : function contours(src) {
        //console.log(' contours 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        let dstc4=new cv.Mat(src.rows,src.cols,cv.CV_8UC4);
        //console.log('contourss function sexecutresss targetsrc width,height:',src.cols,src.rows);
        cv.cvtColor(src, dstc1, cv.COLOR_RGBA2GRAY);
        cv.threshold(dstc1, dstc4, 120, 200, cv.THRESH_BINARY);
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(dstc4, contours, hierarchy,
                        Number(cv.RETR_TREE),
                        Number(cv.CHAIN_APPROX_SIMPLE), {x: 0, y: 0});
        //dstc3.delete();
        // dstC3 = cv.Mat.ones(height, width, cv.CV_8UC3);
        //let dstc3 = cv.Mat.ones(src.rows,src.cols,cv.CV_8UC3);
        let dstc3 = new cv.Mat();
        for (let i = 0; i<contours.size(); ++i) {
            let color = contoursColor[i];
            cv.drawContours(dstc3, contours, i, color, 1, cv.LINE_8, hierarchy);
        }
        cv.cvtColor(dstc3, dstc3, cv.COLOR_RGB2RGBA);
        contours.delete(); hierarchy.delete();
        dstc1.delete();dstc4.delete();src.delete();
        return dstc3;
    },
    //히스토그램(밝기량 표현, 도표형태)
    calcHist : function calcHist(src) {
        //console.log(' calcHist 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        let dstc4=new cv.Mat(src.rows,src.cols,cv.CV_8UC4);
        cv.cvtColor(src, dstc1, cv.COLOR_RGBA2GRAY);
        let srcVec = new cv.MatVector();
        srcVec.push_back(dstc1);
        let scale = 2;
        let channels = [0];
        let histSize = [src.cols/scale];
        const ranges = [0, 255];
        let hist = new cv.Mat();
        let mask = new cv.Mat();
        let color = new cv.Scalar(0xfb, 0xca, 0x04, 0xff);
        cv.calcHist(srcVec, channels, mask, hist, histSize, ranges);
        let result = cv.minMaxLoc(hist, mask);
        let max = result.maxVal;
        cv.cvtColor(dstc1, dstc4, cv.COLOR_GRAY2RGBA);
        // draw histogram on src
        for (let i = 0; i < histSize[0]; i++) {
            let binVal = hist.data32F[i] * src.rows / max;
            cv.rectangle(dstc4, {x: i * scale, y: src.rows - 1},
                            {x: (i + 1) * scale - 1, y: src.rows - binVal/3}, color, cv.FILLED);
        }
        srcVec.delete();
        mask.delete();
        hist.delete();
        dstc1.delete();src.delete();
        return dstc4;
    },
    //이퀄라이즈
    equalizeHist : function equalizeHist(src) {
       // console.log(' equalizeHist 호출>>>>',src.rows,src.cols);
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        cv.cvtColor(src, dstc1, cv.COLOR_RGBA2GRAY, 0);
        cv.equalizeHist(dstc1, dstc1);
        src.delete();
        return dstc1;
    },
    /*let base;//deprecated
    //백프로젝션
    function backprojection(src) {
        let dstc1=new cv.Mat(src.rows,src.cols,cv.CV_8UC1);
        let dstc3=new cv.Mat(src.rows,src.cols,cv.CV_8UC3);
        if (lastFilter !== 'backprojection') {
            if (base instanceof cv.Mat) {
                base.delete();
            }
            base = src.clone();
            cv.cvtColor(base, base, cv.COLOR_RGB2HSV, 0);
        }
        cv.cvtColor(src, dstc3, cv.COLOR_RGB2HSV, 0);
        let baseVec = new cv.MatVector();
        let targetVec = new cv.MatVector();
        baseVec.push_back(base); targetVec.push_back(dstc3);
        let mask = new cv.Mat();
        let hist = new cv.Mat();
        let channels = [0];
        let histSize = [50];
        let ranges;
        if (controls.backprojectionRangeLow < controls.backprojectionRangeHigh) {
            ranges = [controls.backprojectionRangeLow, controls.backprojectionRangeHigh];
        } else {
            return src;
        }
        cv.calcHist(baseVec, channels, mask, hist, histSize, ranges);
        cv.normalize(hist, hist, 0, 255, cv.NORM_MINMAX);
        cv.calcBackProject(targetVec, channels, hist, dstc1, ranges, 1);
        baseVec.delete();
        targetVec.delete();
        mask.delete();
        hist.delete();dstc3.delete();src.delete();
        return dstc1;
    }*/
    //침식
    erosion : function erosion(src) {
        //console.log(' erosion 호출>>>>',src.rows,src.cols);
        let dstc4=new cv.Mat(src.rows,src.cols,cv.CV_8UC4);
        let kernelSize = 6;
        let kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);
        let color = new cv.Scalar();
        cv.erode(src, dstc4, kernel, {x: -1, y: -1}, 1, Number(cv.BORDER_CONSTANT), color);
        kernel.delete();src.delete();
        return dstc4;
    },
    //팽창
    dilation : function dilation(src) {
       // console.log(' dilation 호출>>>>',src.rows,src.cols);
        let dstc4=new cv.Mat(src.rows,src.cols,cv.CV_8UC4);
        let kernelSize = 6;
        let kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);
        let color = new cv.Scalar();
        cv.dilate(src, dstc4, kernel, {x: -1, y: -1}, 1, Number(cv.BORDER_CONSTANT), color);
        kernel.delete();src.delete();
        return dstc4;
        /*let dst=new cv.Mat();
        let M=cv.Mat.ones(5,5,cv.CV_8U);

        let anchor = new cv.Point(-1,-1);
        cv.dilate(src,dst,M,anchor,1,cv.BORDER_CONSTANT,cv.morphologyDefaultBorderValue());

        src.delete();M.delete();
        return dst;*/
    },
    //모폴로지(윤곽선 연산)
    morphology:function morphology(src) {
       // console.log(' morphology 호출>>>>',src.rows,src.cols);
        let dstc3=new cv.Mat(src.rows,src.cols,cv.CV_8UC3);
        let dstc4=new cv.Mat(src.rows,src.cols,cv.CV_8UC4);
        let kernelSize = 7;
        let kernel = cv.getStructuringElement(Number(cv.MORPH_RECT),
                                                {width: kernelSize, height: kernelSize});
        let color = new cv.Scalar();
        let op = Number(cv.MORPH_GRADIENT);
        let image = src;//메모리공간이 추가생성은 아니고,공유한다.밖에서 targetsrc를 어차피 해제한다면 여기서 삭제할시에 밖에서 삭제시 문제?발생여지있음.
        if (op === cv.MORPH_GRADIENT || op === cv.MORPH_TOPHAT || op === cv.MORPH_BLACKHAT) {
            cv.cvtColor(src, dstc3, cv.COLOR_RGBA2RGB);
            image = dstc3;
        }
        cv.morphologyEx(image, dstc4, op, kernel, {x: -1, y: -1}, 1,
                        Number(cv.BORDER_CONSTANT), color);
        kernel.delete();dstc3.delete();src.delete();//image는 자동으로 메모리공간주소 참조를 잃게된다.
        return dstc4;
    },


    //트랜지션 함수 목록들(not ffmpeg, opencv functions)
    transition_Rotation_right: function transition_Rotation_right(mat, mat2){
        let transition = [];
        let N1 = mat.cols;
        let M1 = mat.rows;
        transition[0] = new cv.Mat();
        mat.copyTo(transition[0]);
        
        for(let T=1; T<26;T++){
            console.log('===>>roatet amount:',360-parseFloat(360/52)*T);
            console.log('=\===>>>blursize:',3*T,3*T);
            transition[T] = new cv.Mat();
            mat.copyTo(transition[T]);
            let M = new cv.Mat();
            M = cv.getRotationMatrix2D(new cv.Point(N1/2,M1/2),360-parseFloat(360/52)*T,1);
            let dsize = new cv.Size(N1,M1);
            cv.warpAffine(transition[T],transition[T],M,dsize,cv.INTER_LINEAR,cv.BORDER_DEFAULT, new cv.Scalar());
            cv.blur(transition[T],transition[T],new cv.Size(3*T,3*T),new cv.Point(-1,-1),cv.BORDER_DEFAULT);
        }
    
        //cut2
        for(let T=26; T<52;T++){
            console.log('===>>roatet amount:',360-parseFloat(360/52)*T);
            console.log('=\===>>>blursize:',3*(52-T),3*(52-T));
            transition[T] = new cv.Mat();
            mat2.copyTo(transition[T]);
            let M = new cv.Mat();
            M = cv.getRotationMatrix2D(new cv.Point(N1/2,M1/2),360-parseFloat(360/52)*T,1);
            let dsize = new cv.Size(N1,M1);
            cv.warpAffine(transition[T],transition[T],M,dsize,cv.INTER_LINEAR,cv.BORDER_DEFAULT, new cv.Scalar());
            cv.blur(transition[T],transition[T],new cv.Size(3*(52-T),3*(52-T)),new cv.Point(-1,-1),cv.BORDER_DEFAULT);
        
        }
    
        console.log('transitinosss:',transition);
        return transition;
    },
    transition_Rotation_left:
    //Rotation left
    function transition_Rotation_left(mat, mat2){
        let transition = [];
        let N1 = mat.cols;
        let M1 = mat.rows;
        transition[0] = new cv.Mat();
        mat.copyTo(transition[0]);
        
        for(let T=1; T<26;T++){
            console.log('===>>roatet amount:',360-parseFloat(360/52)*T);
            console.log('=\===>>>blursize:',3*(52-T),3*(52-T));
            transition[T] = new cv.Mat();
            mat.copyTo(transition[T]);
            let M = new cv.Mat();
            M = cv.getRotationMatrix2D(new cv.Point(N1/2,M1/2),parseFloat(360/52)*T,1);
            let dsize = new cv.Size(N1,M1);
            cv.warpAffine(transition[T],transition[T],M,dsize,cv.INTER_LINEAR,cv.BORDER_DEFAULT, new cv.Scalar());
            cv.blur(transition[T],transition[T],new cv.Size(3*T,3*T),new cv.Point(-1,-1),cv.BORDER_DEFAULT);
        }
    
        //cut2
        for(let T=26; T<52;T++){
            console.log('===>>roatet amount:',360-parseFloat(360/52)*T);
            console.log('=\===>>>blursize:',3*(52-T),3*(52-T));
            transition[T] = new cv.Mat();
            mat2.copyTo(transition[T]);
            let M = new cv.Mat();
            M = cv.getRotationMatrix2D(new cv.Point(N1/2,M1/2),parseFloat(360/52)*T,1);
            let dsize = new cv.Size(N1,M1);
            cv.warpAffine(transition[T],transition[T],M,dsize,cv.INTER_LINEAR,cv.BORDER_DEFAULT, new cv.Scalar());
            cv.blur(transition[T],transition[T],new cv.Size(3*(52-T),3*(52-T)),new cv.Point(-1,-1),cv.BORDER_DEFAULT);
        
        }
        console.log('transitinosss:',transition);
    
        return transition;
    },
    //zoom in
    transition_Zoom_in_:
    function transition_Zoom_in_(mat, mat2){
        let transition = [];
        let N1 = mat.cols;
        let M1 = mat.rows;
        transition[0] = new cv.Mat();
        mat.copyTo(transition[0]);
        
        for(let T=1;T<52;T++){
            transition[T] = new cv.Mat();
            mat.copyTo(transition[T]);
            let temp = new cv.Mat();
            cv.resize(transition[0],temp,new cv.Size(N1*(1+0.13*T),M1*(1+0.13*T)));
            let start_r = temp.rows/2 - M1/2;
            let start_c = temp.cols/2 - N1/2;
            for(let i=0;i<M1;i++){
                for(let j=0;j<N1;j++){
                transition[T].ucharPtr(i,j)[0]=temp.ucharPtr(start_r+i,start_c+j)[0];
                transition[T].ucharPtr(i,j)[1]=temp.ucharPtr(start_r+i,start_c+j)[1];
                transition[T].ucharPtr(i,j)[2]=temp.ucharPtr(start_r+i,start_c+j)[2];
                transition[T].ucharPtr(i,j)[3]=temp.ucharPtr(start_r+i,start_c+j)[3];
                }
            }
    
            if(T >=26 && T<52){
                console.log('mat2,mat1(확대된) 각 투명도 합성블랜딩값:',(1/26)*(T-25),(1/26)*(51-T));
                cv.addWeighted(mat2,(1/26)*(T-25),transition[T],(1/26)*(51-T),0,transition[T]);
            }
            /*if(T==11){
                cv.addWeighted(mat2,0.1,transition[T],0.9,0,transition[T]);
            }
            else if(T==12){
                cv.addWeighted(mat2,0.2,transition[T],0.8,0,transition[T]);
            }
            else if(T==13){
                cv.addWeighted(mat2,0.3,transition[T],0.7,0,transition[T]);
            }
            else if(T==14){
                cv.addWeighted(mat2,0.4,transition[T],0.6,0,transition[T]);
            }
            else if(T==15){
                cv.addWeighted(mat2,0.5,transition[T],0.5,0,transition[T]);
            }
            else if(T==16){
                cv.addWeighted(mat2,0.6,transition[T],0.4,0,transition[T]);
            }
            else if(T==17){
                cv.addWeighted(mat2,0.7,transition[T],0.3,0,transition[T]);
            }
            else if(T==18){
                cv.addWeighted(mat2,0.8,transition[T],0.2,0,transition[T]);
            }
            else if(T==19){
                cv.addWeighted(mat2,0.9,transition[T],0.1,0,transition[T]);
            }
            else
                continue;*/
        }
        return transition;
    },
    //대각선 방향으로 사라지기
    transition_flat_diagonal_:
    function transition_flat_diagonal_(mat, mat2){
        let transition = [];
        let N1 = mat.cols;
        let M1 = mat.rows;
        transition[0] = new cv.Mat();
        mat.copyTo(transition[0]);
        for(let T=1; T<39;T++){
             transition[T] = new cv.Mat();
            if(T>30){
                mat2.copyTo(transition[T]);
            }else{
                mat.copyTo(transition[T]);
            }
            let M = cv.Mat.zeros(T*3,T*3,cv.CV_64FC1);
            for(let i=0;i<T*3;i++){
                for(let j=0;j<T*3;j++){
                    if(i==j)
                    M.doublePtr(i,j)[0]=1/(T*3);
                    else
                    M.doublePtr(i,j)[0] =0;
                }
            }
    
            cv.filter2D(transition[T],transition[T],cv.CV_8U,M,new cv.Point(-1,-1), 0,cv.BORDER_DEFAULT);
        }
         //cut2
        let x1 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,5,0,1,5]);
        let x2 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-5,0,1,-5]);
        let x3 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,5,0,1,-5]);
        let x4 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-5,0,1,5]);
        let dsize = new cv.Size(mat.cols,mat.rows);
    
        for(let T=39;T<52;T++){
            transition[T] = new cv.Mat();
            mat2.copyTo(transition[T]);
            if(T%4==0){
                cv.warpAffine(transition[T],transition[T],x1,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            }else if(T%4==1){
                cv.warpAffine(transition[T],transition[T],x2,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            }else if(T%4==2){
                cv.warpAffine(transition[T],transition[T],x3,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            }else if(T%4==3){
                cv.warpAffine(transition[T],transition[T],x4,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            }
        }
        return transition;
    },
    transition_glitch_noise_:
    //글리치 하면서 노이즈 발생  pref
    function transition_glitch_noise_(mat, mat2){
        let transition = [];
        let N1 = mat.cols;
        let M1 = mat.rows;
        transition[0] = new cv.Mat();
        mat.copyTo(transition[0]);
        for(let T=1;T<52;T++){
            let count = [1,1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1];
            let y2 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,N1*T/6,0,1,0]);
            let dsize = new cv.Size(mat.cols,mat.rows);
            transition[T] = new cv.Mat();
            if(T<26)
                mat.copyTo(transition[T]);
            else
                mat2.copyTo(transition[T]);
        
            if(T==26){
                for(let j=0;j<N1;j++){
                    if(Math.sin(j/3)>=0){
                        for(let i=0;i<M1-10;i++){
                            transition[T].ucharPtr(i,j)[0]=transition[T].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[0];
                            transition[T].ucharPtr(i,j)[1]=transition[T].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[1];
                            transition[T].ucharPtr(i,j)[2]=transition[T].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[2];
                        }
                    }
                    else{
                        for(let i=M1;i>=10;i--){
                            transition[T].ucharPtr(i,j)[0]=transition[T].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[0];
                            transition[T].ucharPtr(i,j)[1]=transition[T].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[1];
                            transition[T].ucharPtr(i,j)[2]=transition[T].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[2]; 
                        }
                    }
                }
            }
            else{
                for(let j=0;j<N1;j++){
                    if(Math.sin(j/3)>=0){
                        for(let i=0;i<M1-10;i++){
                            transition[T].ucharPtr(i,j)[0]=transition[T-1].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[0];
                            transition[T].ucharPtr(i,j)[1]=transition[T-1].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[1];
                            transition[T].ucharPtr(i,j)[2]=transition[T-1].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[2];
                        }
                    }
                    else{
                        for(let i=M1;i>=10;i--){
                            transition[T].ucharPtr(i,j)[0]=transition[T-1].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[0];
                            transition[T].ucharPtr(i,j)[1]=transition[T-1].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[1];
                            transition[T].ucharPtr(i,j)[2]=transition[T-1].ucharPtr(i+count[T-1]*10*Math.sin(j/3),j)[2]; 
                        }
                    }
                }
            }
            cv.warpAffine(transition[T],transition[T],y2,dsize,cv.INTER_LINEAR,cv.BORDER_WRAP, new cv.Scalar());
        }
        
        for(let T=1; T<52;T++){
            if(T>=3 && T <= 12){
                for(let i=0;i<M1;i++){
                    for(let j=0;j<N1;j++){
                        if(transition[T].ucharPtr(i,j)[0] * 1.5>255)
                            transition[T].ucharPtr(i,j)[0] = 255;
                        else
                            transition[T].ucharPtr(i,j)[0] *=1.5;
                    }
                }
                for(let i=0;i<M1;i++){
                    for(let j=0;j<N1;j++){
                        if(transition[T].ucharPtr(i,j)[1] * 1.5>255)
                            transition[T].ucharPtr(i,j)[1] = 255;
                        else
                            transition[T].ucharPtr(i,j)[1] *=1.5;
                    }
                }
            }
            else if(T>=13 && T<=22){
                for(let i=0;i<M1;i++){
                    for(let j=0;j<N1;j++){
                        if(transition[T].ucharPtr(i,j)[1] * 1.5>255)
                            transition[T].ucharPtr(i,j)[1] = 255;
                        else
                            transition[T].ucharPtr(i,j)[1] *=1.5;
                    }
                }
            }
            else if(T>=23 && T<=32){
                cv.cvtColor(transition[T],transition[T],cv.COLOR_RGB2GRAY,0);
                cv.bitwise_not(transition[T],transition[T]);
            }
            else if(T>=33 && T<=42){
                for(let i=0;i<M1;i++){
                    for(let j=0;j<N1;j++){
                        if(transition[T].ucharPtr(i,j)[2] * 1.5>255)
                            transition[T].ucharPtr(i,j)[2] = 255;
                        else
                            transition[T].ucharPtr(i,j)[2] *=1.5;
                    }
                }
            }
            else if(T>=43 && T<=51){
                for(let i=0;i<M1;i++){
                    for(let j=0;j<N1;j++){
                        if(transition[T].ucharPtr(i,j)[1] * 1.5>255)
                            transition[T].ucharPtr(i,j)[1] = 255;
                        else
                            transition[T].ucharPtr(i,j)[1] *=1.5;
                    }
                }
                for(let i=0;i<M1;i++){
                    for(let j=0;j<N1;j++){
                        if(transition[T].ucharPtr(i,j)[2] * 1.5>255)
                            transition[T].ucharPtr(i,j)[2] = 255;
                        else
                            transition[T].ucharPtr(i,j)[2] *=1.5;
                    }
                }
            }     
        }
    
        for(let T=1;T<52;T++){
            if(T%4==1 || T%4==2){
                for(let i=0;i<M1/4;i++){
                    for(let j=0;j<N1/4;j++){
                        const random_x = Math.floor(Math.random()*M1);
                        const random_y = Math.floor(Math.random()*N1);
                        const random_i = Math.floor(Math.random()*3)
                        transition[T].ucharPtr(random_x,random_y)[random_i] = 255;
                    }
                }
            }
        }
        return transition;  
    },
    //rgb 글리치 pref
    transition_glitch_:
    function transition_glitch_(mat, mat2){
        let transition = [];
        let N1 = mat.cols;
        let M1 = mat.rows;
        transition[0] = new cv.Mat();
        mat.copyTo(transition[0]);
    
        for(let T=1;T<26;T++){
            transition[T]=new cv.Mat();
            mat.copyTo(transition[T]);
            let rgba = new cv.MatVector();
            let mer = new cv.MatVector();
            let dst = new cv.Mat();
            let rt = new cv.Mat();
            let gt = new cv.Mat();
            let bt = new cv.Mat();
            let x1 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,10,0,1,10]);
            let x2 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-10,0,1,-10]);
            let x3 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,10,0,1,-10]);
            let x4 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-10,0,1,10]);
            let y1 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,24,0,1,24]);
            let y2 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-24,0,1,-24]);
            let y3 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,24,0,1,-24]);
            let y4 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-24,0,1,24]);
        
            let dsize = new cv.Size(mat.cols,mat.rows);
            if(T%4==1)
                cv.warpAffine(transition[T],transition[T],y1,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            else if(T%4==2)
                cv.warpAffine(transition[T],transition[T],y2,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            else if (T%4==3)
                cv.warpAffine(transition[T],transition[T],y3,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            else
                cv.warpAffine(transition[T],transition[T],y4,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
    
            cv.split(transition[T],rgba);
            let r = rgba.get(0);
            let g = rgba.get(1);
            let b = rgba.get(2);
            let ap = rgba.get(3);
            cv.warpAffine(r,rt,x1,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            cv.warpAffine(g,gt,x3,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            cv.warpAffine(b,bt,x2,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            mer.push_back(rt);
            mer.push_back(gt);
            mer.push_back(bt);
            cv.merge(mer,dst);
            dst.copyTo(transition[T]);
        }
    
        //cut 2
        for(let T=26;T<52;T++){
            transition[T]=new cv.Mat();
            mat2.copyTo(transition[T]);
            let rgba = new cv.MatVector();
            let mer = new cv.MatVector();
            let dst = new cv.Mat();
            let rt = new cv.Mat();
            let gt = new cv.Mat();
            let bt = new cv.Mat();
            let x1 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,10,0,1,10]);
            let x2 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-10,0,1,-10]);
            let x3 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,10,0,1,-10]);
            let x4 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-10,0,1,10]);
            let y1 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,24,0,1,24]);
            let y2 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-24,0,1,-24]);
            let y3 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,24,0,1,-24]);
            let y4 = cv.matFromArray(2,3, cv.CV_64FC1, [1,0,-24,0,1,24]);
        
            let dsize = new cv.Size(mat.cols,mat.rows);
            if(T%4==1)
                cv.warpAffine(transition[T],transition[T],y1,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            else if(T%4==2)
                cv.warpAffine(transition[T],transition[T],y2,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            else if (T%4==3)
                cv.warpAffine(transition[T],transition[T],y3,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
            else
                cv.warpAffine(transition[T],transition[T],y4,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT, new cv.Scalar());
        
            cv.split(transition[T],rgba);
            let r= rgba.get(0);
            let g=rgba.get(1);
            let b=rgba.get(2);
            let ap=rgba.get(3);
        
            cv.warpAffine(r,rt,x1,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT,new cv.Scalar());
            cv.warpAffine(g,gt,x3,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT,new cv.Scalar());
            cv.warpAffine(b,bt,x2,dsize,cv.INTER_LINEAR,cv.BORDER_TRANSPARENT,new cv.Scalar());
            mer.push_back(rt);
            mer.push_back(gt);
            mer.push_back(bt);
            cv.merge(mer,dst);
            dst.copyTo(transition[T]);
        }
    
        return transition;
    },

    //선 노이즈
    transition_noise_:
    function transition_noise_(mat, mat2){
        let transition = [];
    
        transition[0] = new cv.Mat();
        mat.copyTo(transition[0]);
    
        let N1 = mat.cols;
        let M1 = mat.rows;
        transition[1]=new cv.Mat();
        mat.copyTo(transition[1]);  
        for (let i = 1; i < 70; i++) {
            if (i % 12 == 0){
                for(let j=0;j<M1;j++){
                    transition[1].ucharPtr(j,parseInt(N1*i/70)-1)[0]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70)-1)[1]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70)-1)[2]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[0]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[1]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[2]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70)+1)[0]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70)+1)[1]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70)+1)[2]=0;
                }
            }
            else if (i % 7 == 0){
                for(let j=0;j<M1;j++){
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[0]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[1]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[2]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70)+1)[0]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70)+1)[1]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70)+1)[2]=0;
                }
            }
            else{
                for(let j=0;j<M1;j++){
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[0]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[1]=0;
                    transition[1].ucharPtr(j,parseInt(N1*i/70))[2]=0;
                }
            }
        }
        for(let T=2;T <=25; T++){
            transition[T]=new cv.Mat();
            transition[1].copyTo(transition[T]);
        }  
        let count = [1,1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,1,1,1,-1,-1,-1,-1,1,1,1,1];
        for(let T=2;T<=25;T++){
            for(let i=0;i<M1;i++){
                if(Math.sin(i/3)>=0){
                    for(let j=0;j<N1-10;j++){
                        transition[T].ucharPtr(i,j)[0]=transition[T-1].ucharPtr(i,j+count[T-2]*3*Math.sin(i/3))[0];
                        transition[T].ucharPtr(i,j)[1]=transition[T-1].ucharPtr(i,j+count[T-2]*3*Math.sin(i/3))[1];
                        transition[T].ucharPtr(i,j)[2]=transition[T-1].ucharPtr(i,j+count[T-2]*3*Math.sin(i/3))[2];
                    }
                }
                else{
                    for(let j=N1;j>=5;j--){
                        transition[T].ucharPtr(i,j)[0]=transition[T-1].ucharPtr(i,j+count[T-2]*3*Math.sin(i/3))[0];
                        transition[T].ucharPtr(i,j)[1]=transition[T-1].ucharPtr(i,j+count[T-2]*3*Math.sin(i/3))[1];
                        transition[T].ucharPtr(i,j)[2]=transition[T-1].ucharPtr(i,j+count[T-2]*3*Math.sin(i/3))[2]; 
                    }
                }
            }
        }
    
        for(let T=0;T<26;T++){
            for(let i=0;i<M1;i++){
                for(let j=0;j<N1;j++){
                    if(transition[T].ucharPtr(i,j)[1] * 1.3>255)
                        transition[T].ucharPtr(i,j)[1] = 255;
                    else
                        transition[T].ucharPtr(i,j)[1] *=1.3;
                }
            }
        }
        
        ////cut 2
        for(let T=26;T <=51; T++){
            transition[T]=new cv.Mat();
                mat2.copyTo(transition[T]);
        }  
        for(let T=27;T<=50;T++){
            for(let i=0;i<M1;i++){
                if(Math.sin(i/3)>=0){
                    for(let j=0;j<N1-10;j++){
                        transition[T].ucharPtr(i,j)[0]=transition[T-1].ucharPtr(i,j+count[T-27]*3*Math.sin(i/3))[0];
                        transition[T].ucharPtr(i,j)[1]=transition[T-1].ucharPtr(i,j+count[T-27]*3*Math.sin(i/3))[1];
                        transition[T].ucharPtr(i,j)[2]=transition[T-1].ucharPtr(i,j+count[T-27]*3*Math.sin(i/3))[2];
                    }
                }
                else{
                    for(let j=N1;j>=5;j--){
                        transition[T].ucharPtr(i,j)[0]=transition[T-1].ucharPtr(i,j+count[T-27]*3*Math.sin(i/3))[0];
                        transition[T].ucharPtr(i,j)[1]=transition[T-1].ucharPtr(i,j+count[T-27]*3*Math.sin(i/3))[1];
                        transition[T].ucharPtr(i,j)[2]=transition[T-1].ucharPtr(i,j+count[T-27]*3*Math.sin(i/3))[2]; 
                    }
                }
            }
        }
        /*for(let T=26;T<52;T++){
            for(let i=0;i<M1;i++){
                for(let j=0;j<N1;j++){
                    if(transition[T].ucharPtr(i,j)[0] * 1.3>255){
                        if(T>=26 && T<=34){
                            transition[T].ucharPtr(i,j)[0] = 255;
                        }else if(T>=35 && T<=43){
                            transition[T].ucharPtr(i,j)[0] = 128;
                            transition[T].ucharPtr(i,j)[1] = 100;
                        }else if(T>=44 && T<=51){
                            transition[T].ucharPtr(i,j)[1] = 255;
                        }
                    }
                    else{
                        if(T>=26 && T<=34){
                            transition[T].ucharPtr(i,j)[0] *=1.3;
                        }else if(T>=35 && T<=43){
                            transition[T].ucharPtr(i,j)[0] *=1.3;
                            transition[T].ucharPtr(i,j)[1] *=1.3;
                        }else if(T>=44 && T<=51){
                            transition[T].ucharPtr(i,j)[1] *=1.3;
                        }
                        
                    }
                }
            }
        }*/
        return transition;
    },
    
    //컷 트랜지션
    transition_cut:
    function transition_cut_(mat, mat2){
        let transition = [];
        
        transition[0] = new cv.Mat();
        mat.copyTo(transition[0]);
        
        let N = mat.cols;
        let M = mat.rows;
        //가로 cut 
        for(let i=1;i<25;i++){
            transition[i]=new cv.Mat();
            transition[i-1].copyTo(transition[i]);
            let rect1 = new cv.Rect(N/36,0,N*35/36,M/2);
            let rect2 = new cv.Rect(0,0,N*35/36,M/2);
            let temp1 = new cv.Mat();
            let temp2 = new cv.Mat();
            temp1 = transition[i].roi(rect1);
            temp2 = transition[i-1].roi(rect2);
            temp2.copyTo(temp1);
            rect1 = new cv.Rect(0, 0, N/36,M/2);
            rect2 = new cv.Rect(N*35/36,0,N/36,M/2);
            temp1 = transition[i].roi(rect1);
            temp2 = transition[i-1].roi(rect2);
            temp2.copyTo(temp1);
            
            rect1 = new cv.Rect(0, M/2, N*35/36,M/2);
            rect2 = new cv.Rect(N/36,M/2,N*35/36,M/2);
            temp1 = transition[i].roi(rect1);
            temp2 = transition[i-1].roi(rect2);
            temp2.copyTo(temp1);
            rect1 = new cv.Rect(N*35/36, M/2, N/36,M/2);
            rect2 = new cv.Rect(0,M/2,N/36,M/2);
            temp1 = transition[i].roi(rect1);
            temp2 = transition[i-1].roi(rect2);
            temp2.copyTo(temp1);
        }

        //세로cut
        transition[25] = new cv.Mat();
        let tt = new cv.Mat();
        mat2.copyTo(transition[25]);
        mat2.copyTo(tt);

        if(1){
            let rect1 = new cv.Rect(0,M*16/36,N/2,M*20/36);
            let rect2 = new cv.Rect(0,0,N/2,M*20/36);
            let temp1 = new cv.Mat();
            let temp2 = new cv.Mat();
            temp1 = transition[25].roi(rect1);
            temp2 = tt.roi(rect2);
            temp2.copyTo(temp1);
            rect1 = new cv.Rect(0, 0, N/2,M*16/36);
            rect2 = new cv.Rect(0,M*20/36,N/2,M*16/36);
            temp1 = transition[25].roi(rect1);
            temp2 = tt.roi(rect2);
            temp2.copyTo(temp1);
            
            rect1 = new cv.Rect(N/2, M*20/36, N/2,M*16/36);
            rect2 = new cv.Rect(N/2,0,N/2,M*16/36);
            temp1 = transition[25].roi(rect1);
            temp2 = tt.roi(rect2);
            temp2.copyTo(temp1);
            rect1 = new cv.Rect(N/2, 0, N/2,M*20/36);
            rect2 = new cv.Rect(N/2,M*16/36,N/2,M*20/36);
            temp1 = transition[25].roi(rect1);
            temp2 = tt.roi(rect2);
            temp2.copyTo(temp1);
        }

        for(let i=26;i<52;i++){
            transition[i] = new cv.Mat();
            transition[i-1].copyTo(transition[i]);
        
            let rect1 = new cv.Rect(0,M/36,N/2,M*35/36);
            let rect2 = new cv.Rect(0,0,N/2,M*35/36);
            let temp1 = new cv.Mat();
            let temp2 = new cv.Mat();
            temp1 = transition[i].roi(rect1);
            temp2 = transition[i-1].roi(rect2);
            temp2.copyTo(temp1);
            rect1 = new cv.Rect(0, 0, N/2,M/36);
            rect2 = new cv.Rect(0,M*35/36,N/2,M/36);
            temp1 = transition[i].roi(rect1);
            temp2 = transition[i-1].roi(rect2);
            temp2.copyTo(temp1);
            
            rect1 = new cv.Rect(N/2, M*35/36, N/2,M/36);
            rect2 = new cv.Rect(N/2,0,N/2,M/36);
            temp1 = transition[i].roi(rect1);
            temp2 = transition[i-1].roi(rect2);
            temp2.copyTo(temp1);
            rect1 = new cv.Rect(N/2, 0, N/2,M*35/36);
            rect2 = new cv.Rect(N/2,M/36,N/2,M*35/36);
            temp1 = transition[i].roi(rect1);
            temp2 = transition[i-1].roi(rect2);
            temp2.copyTo(temp1);
        }

        return transition;
    }
}


module.exports=opencvfunction;