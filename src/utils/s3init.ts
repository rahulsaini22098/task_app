import dotenv from 'dotenv'
import S3 from 'aws-sdk/clients/s3'
dotenv.config()

const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET,
})
export default s3