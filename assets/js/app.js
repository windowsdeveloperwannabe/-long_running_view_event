// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"
import {Socket} from "phoenix"
// import NProgress from "nprogress"
import {LiveSocket} from "phoenix_live_view"
import topbar from "topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
// window.addEventListener("phx:page-loading-start", info => NProgress.start())
// window.addEventListener("phx:page-loading-stop", info => NProgress.done())

topbar.config({
    barThickness: 3,
    barColors: { '1.0': '#0366D6' },
    shadowBlur: 0
})

window.addEventListener('phx:page-loading-start', info => {
    topbar.show()
})

window.addEventListener('phx:page-loading-stop', info => {
    topbar.hide()
})

// connect if there are any LiveViews on the page
liveSocket.connect()
liveSocket.enableDebug()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

