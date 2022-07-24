package com.clllap.util;

import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class ImageUploader {

    private AmazonS3 amazonS3;

    public ImageUploader() {

		String accessKey = "AKIA4C3UNPP36NFSXH6N";
		String secretKey = "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";

        amazonS3 = new AmazonS3Client(new BasicAWSCredentials(accessKey, secretKey));
    }

    public boolean deleteFileInAwsByKey(String path, String fileName) {

        try {
            String bucketName = "pref-bucket/images/clllap/" + path;
            amazonS3.deleteObject(bucketName, fileName);
            return true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return false;
    }

    public boolean uploadImageToAwsS3(String path, MultipartFile file) {

        System.out.println(file.getOriginalFilename());
        String bucketName = "pref-bucket/images/clllap/" + path;
        String fileName = file.getOriginalFilename();
        try {

            File convFile = new File(file.getOriginalFilename());
            convFile.createNewFile();
            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(file.getBytes());
            fos.close();

//		    File result = imageResize(convFile);

            PutObjectRequest putObjectRequeset = new PutObjectRequest(bucketName, fileName, convFile);
            putObjectRequeset.setCannedAcl(CannedAccessControlList.PublicRead);

            amazonS3.putObject(putObjectRequeset);
            convFile.delete();
            return true;

        } catch (Exception ex) {

            System.out.println(ex);
            return false;
        }
    }

    public boolean uploadImageToWithNameAwsS3(String path, MultipartFile file, String fileName) {

        System.out.println(file.getOriginalFilename());
        String bucketName = "pref-bucket/images/clllap/" + path;

        try {
            File convFile = new File(file.getOriginalFilename());
            convFile.createNewFile();
            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(file.getBytes());
            fos.close();

//		    File result = imageResize(convFile);

            PutObjectRequest putObjectRequeset = new PutObjectRequest(bucketName, fileName, convFile);
            putObjectRequeset.setCannedAcl(CannedAccessControlList.PublicRead);

            amazonS3.putObject(putObjectRequeset);
            convFile.delete();
            return true;

        } catch (Exception ex) {

            ex.printStackTrace();
            System.out.println("index : " + ex);
            return false;
        }
    }

    // 파일 다운로드
    public Object downloadFile(String folder, String fileName) {
        try {
            S3Object object = amazonS3.getObject(new GetObjectRequest("pref-bucket/images/bnh/" + folder, fileName));
            S3ObjectInputStream s3is = object.getObjectContent();

            byte[] download_file = IOUtils.toByteArray(s3is);

            return download_file;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public File imageResize(File file) {

        String imgFormat = "jpg"; // 새 이미지 포맷. jpg, gif 등
        int newWidth = 600; // 변경 할 넓이
        int newHeight = 700; // 변경 할 높이
        String mainPosition = "W"; // W:넓이중심, H:높이중심, X:설정한 수치로(비율무시)

        Image image;
        int imageWidth;
        int imageHeight;
        double ratio;
        int w;
        int h;

        try {
            // 원본 이미지 가져오기
            image = ImageIO.read(file);

            // 원본 이미지 사이즈 가져오기
            imageWidth = image.getWidth(null);
            imageHeight = image.getHeight(null);

            if (mainPosition.equals("W")) { // 넓이기준

                ratio = (double) newWidth / (double) imageWidth;
                w = (int) (imageWidth * ratio);
                h = (int) (imageHeight * ratio);

            } else if (mainPosition.equals("H")) { // 높이기준

                ratio = (double) newHeight / (double) imageHeight;
                w = (int) (imageWidth * ratio);
                h = (int) (imageHeight * ratio);

            } else { // 설정값 (비율무시)

                w = newWidth;
                h = newHeight;
            }

            // 이미지 리사이즈
            // Image.SCALE_DEFAULT : 기본 이미지 스케일링 알고리즘 사용
            // Image.SCALE_FAST : 이미지 부드러움보다 속도 우선
            // Image.SCALE_REPLICATE : ReplicateScaleFilter 클래스로 구체화 된 이미지 크기 조절 알고리즘
            // Image.SCALE_SMOOTH : 속도보다 이미지 부드러움을 우선
            // Image.SCALE_AREA_AVERAGING : 평균 알고리즘 사용
            Image resizeImage = image.getScaledInstance(w, h, Image.SCALE_AREA_AVERAGING);

            // 새 이미지 저장하기
            BufferedImage newImage = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
            Graphics g = newImage.getGraphics();
            g.drawImage(resizeImage, 0, 0, null);
            g.dispose();

            File resultFile = new File(file.getName());
            ImageIO.write(newImage, imgFormat, resultFile);

            return resultFile;

        } catch (Exception e) {

            e.printStackTrace();
            return null;
        }

    }

}