export const validateEnvironment = () => {
  const required = [
    'MONGODB_URI',
    'GOOGLE_ID',
    'GOOGLE_CLIENT_SECRET',
    'AUTH_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `[ENV] Missing required environment variables: ${missing.join(', ')}`
    );
  }

  console.log('[ENV] All required environment variables configured');
};
