// test-s3-upload.js
// Run this with: node test-s3-upload.js

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config()

async function testS3Upload() {
  console.log('Testing S3 upload with your credentials...\n')

  // Check environment variables
  const requiredVars = ['S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']
  const missing = requiredVars.filter((v) => !process.env[v])

  if (missing.length > 0) {
    console.error('Missing environment variables:', missing)
    return
  }

  console.log('Environment check:')
  console.log('- S3_BUCKET:', process.env.S3_BUCKET)
  console.log('- S3_REGION:', process.env.S3_REGION)
  console.log('- S3_ACCESS_KEY_ID:', process.env.S3_ACCESS_KEY_ID?.substring(0, 8) + '...')
  console.log('- S3_SECRET_ACCESS_KEY:', process.env.S3_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET')
  console.log()

  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  })

  try {
    // Test upload
    const testContent = `Test upload at ${new Date().toISOString()}`
    const testKey = `media/test-${Date.now()}.txt`

    console.log('Attempting to upload test file...')

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    })

    const uploadResult = await s3Client.send(uploadCommand)
    console.log('✅ Upload successful!')
    console.log('Upload result:', uploadResult)
    console.log(
      `File URL: https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${testKey}`,
    )

    // Test read
    console.log('\nTesting file read...')
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: testKey,
    })

    const getResult = await s3Client.send(getCommand)
    console.log('✅ Read successful!')
    console.log('File exists and is accessible')
  } catch (error) {
    console.error('❌ S3 operation failed:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.$metadata?.httpStatusCode)

    if (error.name === 'CredentialsProviderError') {
      console.error('\n💡 This is likely a credentials issue. Check your:')
      console.error('- S3_ACCESS_KEY_ID')
      console.error('- S3_SECRET_ACCESS_KEY')
    } else if (error.name === 'NoSuchBucket') {
      console.error('\n💡 Bucket not found. Check:')
      console.error('- S3_BUCKET name is correct')
      console.error('- S3_REGION matches bucket region')
    } else if (error.name === 'AccessDenied') {
      console.error('\n💡 Permission denied. Check:')
      console.error('- IAM user has s3:PutObject permission')
      console.error('- Bucket policy allows your operations')
    }
  }
}

testS3Upload()
