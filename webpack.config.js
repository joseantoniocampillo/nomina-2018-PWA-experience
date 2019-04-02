const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    workboxPlugin = require('workbox-webpack-plugin'),
    dist = 'dist';
module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, dist),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, dist),
        compress: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            particular: 'contenido del div',
            title: 'Calculadora de dietas',
            template: 'src/template.html'
        }),
        new workboxPlugin({
            globDirectory: dist,
            globPatterns: ['**/*.{html,js,css}'],
            /* swSrc: './src/sw.js', */ //FIXME: requiere comentar para genererara nuevos sw
            swDest: path.join(dist, 'sw.js')
        })
    ]
}