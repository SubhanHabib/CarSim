const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const ip = require('ip')
const portFinderSync = require('portfinder-sync')

const infoColor = _message => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer: {
            host: 'local-ip',
            port: portFinderSync.getPort(8080),
            open: false,
            https: false,
            allowedHosts: 'all',
            hot: false,
            watchFiles: ['src/**', 'assets/**'],
            static: {
                watch: true,
                directory: path.join(__dirname, '../assets')
            },
            onAfterSetupMiddleware: function(devServer) {
                const port = devServer.options.port
                const https = devServer.options.https ? 's' : ''
                const localIp = ip.address()
                const domain1 = `http${https}://${localIp}:${port}`
                const domain2 = `http${https}://localhost:${port}`

                console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
            }
        }
    }
)
