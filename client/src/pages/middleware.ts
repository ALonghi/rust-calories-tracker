import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
    console.log(`middleware called!`)
    // Getting cookies from the request using the `RequestCookies` API
    let userToken = request.cookies.get('token')?.value
    console.log(`userToken ${userToken}`) // => 'fast'
    const allCookies = request.cookies.getAll()
        // Clone the request headers and set a new header `x-hello-from-middleware1`
    const requestHeaders = new Headers(request.headers)
    console.log(`allCookies ${allCookies}`) // => [{ name: 'nextjs', value: 'fast' }]
    if (!userToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    } else {
        return NextResponse.next({
            request: {
                // New request headers
                headers: requestHeaders,
            },
        })
    }
}
