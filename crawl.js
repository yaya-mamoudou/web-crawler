import { JSDOM } from 'jsdom'

export function normalizeUrl(url) {
    const urlObject = new URL(url)
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`

    if (hostPath.length > 0 && hostPath.trim().slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }

    return hostPath
}
''.trim()
export function getUrlFromHTML(htmlBody, baseUrl) {
    if (baseUrl.trim().endsWith('/')) baseUrl = baseUrl.slice(0, -1)

    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    const urls = []

    linkElements.forEach(elementURL => {
        if (elementURL.href.trim()[0] === '/') {
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

export async function crawlPage(baseUrl, currentURL, pages) {

    const baseURLObj = new URL(baseUrl)
    const currentURLObj = new URL(currentURL)
    if (baseURLObj.hostname !== currentURLObj.hostname) return pages

    const normalizedCurrentURL = normalizeUrl(currentURL)
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`Actively crawling: ${currentURL}`)

    try {
        const res = await fetch(currentURL)
        const contentType = res.headers.get('content-type')

        if (!contentType.includes('text/html')) {
            throw new Error(`Non html response.\nContent type: ${contentType}`)
        }

        if (res.status > 399) throw new Error(`status code - ${res.status}`)

        const htmlData = await res.text()
        const nextURLs = getUrlFromHTML(htmlData, baseUrl)

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseUrl, nextURL, pages)
        }

    } catch (error) {
        console.error(`\nError in fetching: ${error.message}\nPage: ${currentURL}`)
    }

    finally {
        return pages
    }
}