export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'jwtsecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
}); 