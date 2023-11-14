import * as dotenv from 'dotenv';
dotenv.config();

const APP_PORT = process.env.APP_PORT || 3001;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
const JWT_SECOND_PASSWORD = process.env.JWT_SECOND_PASSWORD || '';
const JWT_RESETPASSWORD_SECRET = process.env.JWT_RESETPASSWORD_SECRET || '';
const JWT_RESETCODE_SECRET = process.env.JWT_RESETCODE_SECRET || '';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const GOOGLE_CLIENT_ID = String(process.env.GG_CLIENT_ID) || '';
const GOOGLE_CLIENT_SECRET = String(process.env.GG_CLIENT_SECRET) || '';
const GG_CLIENT_ID_IOS = String(process.env.GG_CLIENT_ID_IOS) || '';
const GG_CLIENT_ID_AND = String(process.env.GG_CLIENT_ID_AND) || '';

const FACEBOOK_ID = String(process.env.FB_ID) || '';
const FACEBOOK_SECRET = String(process.env.FB_SECRET) || '';

const MULTER_DEST = process.env.MULTER_DEST || '';
const APP_URL = process.env.APP_URL || '';

export {
  APP_PORT,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY,
  STRIPE_WEBHOOK_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GG_CLIENT_ID_IOS,
  GG_CLIENT_ID_AND,
  FACEBOOK_ID,
  FACEBOOK_SECRET,
  JWT_SECOND_PASSWORD,
  JWT_RESETPASSWORD_SECRET,
  JWT_RESETCODE_SECRET,
  MULTER_DEST,
  APP_URL,
};
