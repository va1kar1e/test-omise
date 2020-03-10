import dotenv from 'dotenv'
dotenv.config();

export const config = {
  // env
  env: process.env.NODE_ENV,
  // server
  port: process.env.API_PORT,
  imageHost: process.env.IMAGE_HOST,
  // db
  dbUrl: process.env.DB_URL,
  // log
  logLevel: process.env.LOG_LEVEL,
  logFileName: process.env.LOG_FILE_NAME,
  logAppenders: process.env.LOG_APPENDERS,
  // hash
  algo: process.env.ALGO,
  iterations: process.env.ITERATIONS,
  saltLength: process.env.SALT_LENGTH,
  // jwt
  secret: process.env.SECRET,
  expireIn: process.env.EXPIRE_IN,
  // email
  emailHost: process.env.EMAIL_HOST,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailPort: process.env.EMAIL_PORT,
  officialEmail: process.env.OFFICIAL_EMAIL,
  // verify email
  verifyUrl: process.env.VERIFY_URL,
  // reset password
  resetPassUrl: process.env.RE_PASS_URL,
  // permission
  admin: process.env.ADMIN_PERMISSION
}
