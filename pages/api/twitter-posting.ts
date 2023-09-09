import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import Parser from 'rss-parser';

// Initializing the cors middleware
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
})



const parser = new Parser<CustomItem>({
    customFields: {
        item: ['description', 'category']
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

const getPosts = async () => {

    const feed = await parser.parseURL('https://ona.org.ru/rss');

    const posts: Post[] = [];

    feed.items.forEach(item => {
        posts.push(<Post>{
            title: item.title,
            description: item.description,
            link: item.link,
            category: item.category
        })
    })

    console.log(posts);

    return posts;
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // Run the middleware
    await runMiddleware(req, res, cors)


    res.json(await getPosts());
}

export default handler;

type Post = {
    'title': string,
    'description': string,
    'link': string
    'category': Category
}
type Category = string;
type CustomItem = {description: string, category: string};