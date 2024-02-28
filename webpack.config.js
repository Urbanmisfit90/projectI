const path = require('path');

module.exports = {
  mode: 'development', // Set mode to 'development' or 'production'
  entry: './src/main.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file name
  },
  resolve: {
    extensions: ['.js'], // Add '.js' extension to resolve
  },
  module: {
    rules: [
      // Add any necessary loaders for your project (e.g., Babel for JavaScript)
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader', // Use babel-loader for transpiling
          options: {
            presets: ['@babel/preset-env'], // Set babel presets to env
          },
        },
      },
    ],
  },
  devtool: 'eval-source-map', // Enable source maps for easier debugging
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // Serve content from the 'dist' directory
    compress: true, // Enable gzip compression for everything served
    port: 9000, // Specify the port number
    open: true, // Open the default browser when the server starts
  },
};
