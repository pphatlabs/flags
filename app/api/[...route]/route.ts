import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { NextResponse } from 'next/server'
export const runtime = 'edge'

interface Country {
    name: string;
    code: string;
    flag: string;
    topLevelDomain: [
        undefined
    ];
}

const app = new Hono().basePath('/api')


app.get('/flag/:size/:domain', async (c) => {

    const { size, domain } = c.req.param()
    const imageUrl      = new URL(`/flags/${size ?? '4x3'}/${domain}.svg`, c.req.url)
    const response      = await fetch(imageUrl)

    if (response.status == 200) {
        const arrayBuffer   = await response.arrayBuffer()
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml', },
        })
    }
    else
        return c.html(domain, 404)
})


app.get('/flags', async (c) => {

    const { limit = '10', page = '1' } = c.req.query()

    const jsonUrl       = new URL('/data/countries.json', c.req.url)
    const response      = await fetch(jsonUrl)
    const countries: Country[] = await response.json()

    const skip          = (Number(page) - 1) * Number(limit)
    const result        = countries.slice(skip, skip + Number(limit))
    const total         = countries.length
    const totalPages    = Math.ceil(total / Number(limit))

    return c.json({
        pagination: {
            limit: Number(limit),
            total,
            skip,
            offset: skip,
            totalPages,
            page: Number(page),
        },
        result: result,
    })
})

export const GET = handle(app)