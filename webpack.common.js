const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
let htmlPageNames = ["index", "404"];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/${name}.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    title: "Oor.lu",
    meta: {
      charset: "UTF-8",
      viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      "theme-color": "#ffd571",
      description:
        "Free and fast URL shortener to create perfect URLs. Shorten long URLs to share on social media. Enter the long link to get your short link. Free API access",
      "application-name": "Oor.lu",
      author: "Adam Wojtczak, Dalius Slavickas",
      keywords:
        "url, shortener, JavaScript, HTML, CSS, Python, Django, PostgreSQL, Redis",

      content:
        "url shortener, link, bitly, tinyurl, api, branded urls, links shortener, tiny url, short url, short link, links shortening, url traffic stats, url tracking, free url shortener, custom url shortener, shortening url, shorten url, shorten links, url, link, url redirect, shorter link, customize url, customize link, url shortener no ads, url shortener without ads, click stats, cuttly",
    },
  });
});

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer()],
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "static/images",
              esModule: false,
              name: "[name].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          outputPath: "static/fonts",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CleanWebpackPlugin(),
    new FaviconsWebpackPlugin({
      logo: "./src/images/oorlu.png",
      outputPath: "static/favicon",
      prefix: "static/favicon/",
    }),
  ].concat(multipleHtmlPlugins),
};
