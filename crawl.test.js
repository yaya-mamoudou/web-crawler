const { normalizeUrl, getUrlFromHTML } = require('./crawl')
const { test, expect } = require('@jest/globals')

test('normalizeUrl: strip protocol ', () => {
    const input = 'https://www.google.com/path'
    const expected = 'www.google.com/path'
    const actual = normalizeUrl(input)

    expect(actual).toEqual(expected)
})

test('normalizeUrl: strip trailing slash ', () => {
    const input = 'https://www.google.com/path/'
    const expected = 'www.google.com/path'
    const actual = normalizeUrl(input)

    expect(actual).toEqual(expected)
})

test('normalizeUrl: capitals', () => {
    const input = 'https://www.GOOGLE.com/path/'
    const expected = 'www.google.com/path'
    const actual = normalizeUrl(input)

    expect(actual).toEqual(expected)
})

test('normalizeUrl: strip http', () => {
    const input = 'http://www.GOOGLE.com/path/'
    const expected = 'www.google.com/path'
    const actual = normalizeUrl(input)

    expect(actual).toEqual(expected)
})


// GetUrlFromHTML

test('getUrlFromHTML: absolute', () => {
    const input = `
        <html>
            <body>
                <a href="https://blog.boot.dev/">
                    Boot.dev Blog
                </a>
                <a href="https://google.com/">
                    Google.com Blog
                </a>
            </body>
        </html>
    `
    const inputBaseURL = 'https://blog.boot.dev'
    const expected = ['https://blog.boot.dev/', 'https://google.com/']
    const actual = getUrlFromHTML(input, inputBaseURL)

    expect(actual).toEqual(expected)
})

test('getUrlFromHTML: relative', () => {
    const input = `
        <html>
            <body>
                <a href="/path">
                    Boot.dev Blog
                </a>
                <a href="/blogs">
                    Google.com Blog
                </a>
            </body>
        </html>
    `
    const inputBaseURL = 'https://blog.boot.dev'
    const expected = ['https://blog.boot.dev/path', 'https://blog.boot.dev/blogs']
    const actual = getUrlFromHTML(input, inputBaseURL)

    expect(actual).toEqual(expected)
})

test('getUrlFromHTML: invalid', () => {
    const input = `
        <html>
            <body>
                <a href="path">
                    Invalid URL
                </a>
            </body>
        </html>
    `
    const inputBaseURL = 'https://blog.boot.dev'
    const expected = []
    const actual = getUrlFromHTML(input, inputBaseURL)

    expect(actual).toEqual(expected)
})



