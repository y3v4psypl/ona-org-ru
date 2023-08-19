import {useEffect, useState} from "react";

const getPostList = async (): Promise<Post[]> => {
    const postList = await fetch('./api/twitter-posting');

    return postList.json();
}


export default function PostList() {
    const [state, setState] = useState('loading');
    const [postListItems, setPostListItems] = useState<JSX.Element[]>([<></>])

    const checkAndModifyPostText = (description: string, title: string, link: string): string => {
        const checkLength = (string: string) => string.length <= 280

        let postText = `🚺 ${title.replaceAll('&laquo;', '«').replaceAll('&raquo;', '»')} 🚺 \n`
            + description.replaceAll(/<div[^>]*>(.+)<\/div>/gmi, '')
                .replaceAll('&laquo;', '«').replaceAll('&raquo;', '»')
                .replaceAll('<p>','')
                .replaceAll('</p>', '\n')
                .replaceAll('<!-- more -->', '')
                .replaceAll(/<a[^>]+>/gmi, '')
                .replaceAll('</a>', '')
            + `\n ${link}`

        const shortenPostText = (text: string): string => {
            if ((text.substring(0, text.lastIndexOf(' ')) + '…').length > 280) {
                return shortenPostText(text.substring(0, text.lastIndexOf(' ')) + '…')
            } else {
                return text.substring(0, text.lastIndexOf(' ')) + '…'
            }
        }

        if (checkLength(postText)) { return postText }
        else {
            return shortenPostText(postText)
        }
    }


    useEffect(() => {
        let postList = getPostList().then((posts): Post[] => posts);

        postList.then(res => {
            setPostListItems(res.map((post, i) => <li key={i}>{checkAndModifyPostText(post.description, post.title, post.link)}</li>))
            setState('success')
        })

    }, [])



    return (
        <ul>{state === 'success' ? postListItems : <>Loading...</>}</ul>
    )
}

type Post = {
    'title': string,
    'description': string,
    'link': string
}