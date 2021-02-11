export default {
  options: {
    expiresIn: '7d',
  },
  privateKey: `${process.env.AUTH_SECRET}`,
};
