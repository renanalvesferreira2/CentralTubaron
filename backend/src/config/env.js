import dotenv from 'dotenv';

dotenv.config();

const demoMode = process.env.DEMO_MODE !== 'false';
const required = demoMode ? ['JWT_SECRET'] : ['JWT_SECRET', 'DATABASE_URL'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

function parseNumber(key, fallback, { min, max } = {}) {
  const value = Number(process.env[key] || fallback);

  if (!Number.isFinite(value) || (min !== undefined && value < min) || (max !== undefined && value > max)) {
    throw new Error(`Invalid environment variable: ${key}`);
  }

  return value;
}

function validateSecret() {
  const secret = process.env.JWT_SECRET || '';

  if (secret === 'change_this_secret') {
    throw new Error('JWT_SECRET must be changed before running the application.');
  }

  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('JWT_SECRET must have at least 32 characters in production.');
  }
}

function validateUrl(key, value, { required: isRequired = false } = {}) {
  if (!value && !isRequired) return value;
  if (!value) throw new Error(`Missing required environment variable: ${key}`);

  const url = new URL(value);

  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error(`${key} must use HTTPS in production.`);
  }

  return value.replace(/\/+$/, '');
}

function requireWhenMockDisabled(prefix, useMock, keys) {
  if (useMock) return;

  for (const key of keys) {
    if (!process.env[`${prefix}_${key}`]) {
      throw new Error(`Missing required environment variable: ${prefix}_${key}`);
    }
  }
}

validateSecret();

const ixcUseMock = process.env.IXC_USE_MOCK === 'true';
const geminiUseMock = process.env.GEMINI_USE_MOCK === 'true';
const huaweiUseMock = process.env.HUAWEI_USE_MOCK === 'true';

requireWhenMockDisabled('IXC', ixcUseMock, ['BASE_URL', 'TOKEN']);
requireWhenMockDisabled('GEMINI', geminiUseMock, ['API_KEY']);
requireWhenMockDisabled('HUAWEI', huaweiUseMock, ['BASE_URL', 'TOKEN']);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  demoMode,
  port: parseNumber('PORT', 4000, { min: 1, max: 65535 }),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  bcryptRounds: parseNumber('BCRYPT_ROUNDS', 12, { min: 10, max: 14 }),
  ixc: {
    baseUrl: validateUrl('IXC_BASE_URL', process.env.IXC_BASE_URL, { required: !ixcUseMock }),
    token: process.env.IXC_TOKEN,
    useMock: ixcUseMock
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    useMock: geminiUseMock
  },
  huawei: {
    baseUrl: validateUrl('HUAWEI_BASE_URL', process.env.HUAWEI_BASE_URL, { required: !huaweiUseMock }),
    token: process.env.HUAWEI_TOKEN,
    useMock: huaweiUseMock
  }
};
