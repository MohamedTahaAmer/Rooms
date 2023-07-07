import axios from 'axios'

export async function GET(req: Request) {
  // >(4:22) to get teh href, you first need to get the url class
  const url = new URL(req.url)
  const href = url.searchParams.get('url')

  // - how is that possiple to reatch this endpoint without having an href
  if (!href) {
    return new Response('Invalid href', { status: 400 })
  }

  // >(4:20) this res, will containg the html of the url passed to this endpoint
  const res = await axios.get(href)

  // Parse the HTML title using regular expressions
  // - match return an array of all matches, matchAll return an array of arrays, each array repesents a single match and it's groups
  const titleMatch = res.data.match(/<title>(.*?)<\/title>/)
  const title = titleMatch ? titleMatch[1] : ''

  // >(4:24) this (.*?) is a good regex hack, which matches any thing between your strings, and will also match the stings them selves
  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)"/
  )
  const description = descriptionMatch ? descriptionMatch[1] : ''

  const imageMatch = res.data.match(/<meta property="og:image" content="(.*?)"/)
  const imageUrl = imageMatch ? imageMatch[1] : ''

  // Return the data in the format required by the editor tool
  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    })
  )
}
