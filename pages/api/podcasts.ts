import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import Parser from 'rss-parser';

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})



const parser = new Parser<CustomItem>({
  customFields: {
    item: ['description']
  }
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
const runMiddleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const getPodcasts = async () => {

  const feed = await parser.parseURL('https://cloud.mave.digital/42891');

  const podcasts: Podcast[] = [];

  feed.items.forEach(item => {
    podcasts.push(<Podcast>{
      title: item.title,
      description: item.description,
      link: item.enclosure?.url
    })
  })

  console.log(podcasts);

  return podcasts;
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
  // Run the middleware
  await runMiddleware(req, res, cors)


  res.json(await getPodcasts());
}

export default handler;

type Podcast = {
  'title': string,
  'description': string,
  'link': string
}

type CustomItem = {description: string};