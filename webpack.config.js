/**
 * webpack.config.js
 * @author Wilfredo Pacheco
 */

const path = require('path');
const chalk = require("chalk");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = {

    mode: 'production', // "production" | "development" | "none"
    // mode: 'development', // "production" | "development" | "none"
    // mode: 'none', // "production" | "development" | "none"
    // Chosen mode tells webpack to use its built-in optimizations accordingly.

    // defaults to ./src
    entry: './app.js', // string | object | array

    output: {

        path: path.resolve(__dirname, 'dist'), // string (default)
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)

        /** @reference https://stackoverflow.com/questions/64294706/webpack5-automatic-publicpath-is-not-supported-in-this-browser */
        publicPath: '',

        filename: 'app.bundle.js', // string (default)
        // the filename template for entry chunks

    },

    plugins: [
        
        // Progress bar
        new ProgressBarPlugin({
            format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
        }),
    ],

    optimization: {
        // mangleExports: false,
        // rename export names to shorter names
    },

};