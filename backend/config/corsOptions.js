const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [
      process.env.CLIENT_URL,
      'https://apppatin-frontend.onrender.com',
      'http://localhost:5173',
    ];

const isVercelDomain = (origin) => /\.vercel\.app$/.test(origin || '');

module.exports = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isVercelDomain(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
