import dotenv from 'dotenv';

dotenv.config();

const required = ['JWT_SECRET', 'DATABASE_URL'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
  ixc: {
    baseUrl: process.env.IXC_BASE_URL,
    token: process.env.IXC_TOKEN,
    useMock: process.env.IXC_USE_MOCK === 'true'
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    useMock: process.env.GEMINI_USE_MOCK === 'true'
  },
  huawei: {
    baseUrl: process.env.HUAWEI_BASE_URL,
    token: process.env.HUAWEI_TOKEN,
    useMock: process.env.HUAWEI_USE_MOCK === 'true'
  }
};
