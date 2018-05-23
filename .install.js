module.exports = async (ctx, name) => {
  return {
    prefix: '/',
    path: './public',
    historyApiFallback: true
  };
};