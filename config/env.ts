export const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACC_SECRECT: process.env.JWT_ACC_SECRECT,
  JWT_ACC_EXPIRES_IN: process.env.JWT_ACC_EXPIRES_IN || '15m',
  JWT_REF_SECRECT: process.env.JWT_REF_SECRECT,
  JWT_REF_EXPIRES_IN: process.env.JWT_REF_EXPIRES_IN || '7d',
};