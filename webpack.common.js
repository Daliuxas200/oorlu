const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
                test: /\.(sa|sc|c)ss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()],
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/images',
                            esModule: false
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ],

            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'static/fonts',
                }
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            title: 'Oor.lu',
            filename: 'index.html',
            template: './src/index.html',
            meta: {
                'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
                'theme-color': '#ffd571',
                'description': 'A light and fun app for shortening urls',
                'application-name': 'Oor.lu',
                'author': 'Adam Wojcak, Dalius Slavickas',
                'keywords' : 'url, shortener, JavaScript, HTML, CSS, Python, Django, PostgreSQL, Redis'
            }
        }),
        new CleanWebpackPlugin(),
        new FaviconsWebpackPlugin({
            logo: './src/images/oorlu.png',
            outputPath: 'static/favicon',
            prefix: 'static/favicon/'
        })
    ],
};