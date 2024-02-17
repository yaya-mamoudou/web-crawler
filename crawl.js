const { JSDOM } = require('jsdom')

function normalizeUrl(url) {
    const urlObject = new URL(url)
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }

    return hostPath
}

function getUrlFromHTML(htmlBody, baseUrl) {
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    const urls = []

    linkElements.forEach(elementURL => {
        if (elementURL.href[0] === '/') {
            elementURL.href = `${baseUrl}${elementURL.href}`
            urls.push(elementURL.href)
        }

        else {
            try {
                new URL(elementURL.href)
                urls.push(elementURL.href)
            } catch (error) {
                console.log(`'${elementURL.href}' is an invalid absolute url`);
            }
        }



    })

    return urls
}

module.exports = {
    normalizeUrl,
    getUrlFromHTML
}