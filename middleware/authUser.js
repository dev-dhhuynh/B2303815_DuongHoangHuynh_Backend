const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];

  console.log('🔐 authUser middleware called');
  console.log('🔐 Token from header:', token ? `YES (${token.length} chars)` : 'NO');

  if (!token) {
    console.error('❌ No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    console.log('🔐 authUser payload:', payload);
    console.log('🔐 payload.id:', payload.id);
    console.log('🔐 payload.id type:', typeof payload.id);

    const userId = String(payload.id || payload._id || '');

    console.log('🔐 userId (string):', userId);

    if (!userId || userId === 'undefined' || userId === 'null') {
      console.error('❌ Invalid token payload - no id');
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = {
      id: userId,
      role: payload.role || 'user',
      email: payload.email
    };

    console.log('✅ authUser middleware passed, user id:', req.user.id);
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};