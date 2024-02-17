import { JSDOM } from 'jsdom'

export function normalizeUrl(url) {
    const urlObject = new URL(url)
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }

    return hostPath
}

export function getUrlFromHTML(htmlBody, baseUrl) {
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1)

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

export async function crawlPage(currentUrl) {
    console.log(`Crawling: ${currentUrl}`)

    try {
        const res = await fetch(currentUrl);
        const contentType = res.headers.get('content-type')

        if (!contentType.includes('text/html')) {
            throw new Error(`Non html response.\nContent type: ${contentType}`)
        }

        if (res.status > 399) throw new Error(`status code - ${res.status}`)

        return await res.text()
    } catch (error) {
        console.error(`\nError in fetching: ${error.message}\nPage: ${currentUrl}
        `);
    }
}