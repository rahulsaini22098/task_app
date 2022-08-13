import dotenv from 'dotenv'
import s3 from '../../utils/s3init'
import fs from 'fs'
dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME || ''

export const uploadFile = (file: Express.Multer.File) => {
    const stream = fs.createReadStream(file.path)
    const uploadStream = {
        Bucket: bucketName,
        Body: stream,
        Key: file.filename
    }   

    return s3.upload(uploadStream).promise()
}

// export const getFile = () => {}