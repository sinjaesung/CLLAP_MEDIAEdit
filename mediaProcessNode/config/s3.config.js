const AWS=require('aws-sdk');
const env = require('./s3.env.js');

const s3client = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey :env.AWS_SECRET_ACCESS_KEY,
});

const uploadparams={
    Bucket:'clllap',
    Key:'clllap/',
    Body: null,
    ACL : 'public-read',
    
};

const s3={};
s3.s3client= s3client;
s3.uploadParams=uploadparams;

module.exports=s3;

