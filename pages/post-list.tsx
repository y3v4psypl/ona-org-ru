import {useEffect, useState} from "react";

const getPostList = async (): Promise<Post[]> => {
    const postList = await fetch('./api/twitter-posting');

    return postList.json();
}


export default function PostList() {
    const [state, setState] = useState('loading');
    const [postListItems, setPostListItems] = useState<JSX.Element[]>([<></>])

    const checkAndModifyPostText = (description: string, title: string, link: string, categories: Category[]): string[] => {
        const checkLength = (string: string) => string.length <= 280;
        const hashtagString = categories.map(c => "#" + c + " ").join('');
        const postTitle = `🚺 ${title.replaceAll('&laquo;', '«').replaceAll('&raquo;', '»')} 🚺 \r\n`

        let postDescription = description.replaceAll(/<div[^>]*>(.+)<\/div>/gmi, '')
            .replaceAll('&laquo;', '«').replaceAll('&raquo;', '»')
            .replaceAll('<h1>', '')
            .replaceAll('<h2>', '')
            .replaceAll('<h3>', '')
            .replaceAll('</h1>', '\r\n')
            .replaceAll('</h2>', '\r\n')
            .replaceAll('</h3>', '\r\n')
            .replaceAll(/<p[^>]+>/gmi,'')
            .replaceAll('<p>&mdash;&mdash;&mdash;</p>', '')
            .replaceAll('<p>', '')
            .replaceAll('</p>', '\r\n')
            .replaceAll('<!-- more -->', '')
            .replaceAll(/<a[^>]*>(.+)<\/a>/gmi, '')
            .replaceAll('<a>', '')
            .replaceAll('</a>', '')
            .replaceAll('<small>', '')
            .replaceAll(/<small[^>]*>(.+)<\/small>/gmi, '')
            .replaceAll('</small>', '')
            .replaceAll('<b>', '')
            .replaceAll('</b>', '')
            .replaceAll('<i>', '')
            .replaceAll('</i>', '')
            .replaceAll(/<figure[^>]*>(.+)<\/figure>/gmi, '')

        const shortenPostDescription = (text: string): string => {
            if (!checkLength(postTitle + text.substring(0, text.lastIndexOf(' ')) + '…' + `\r\n ${link}` + `\r\n ${hashtagString}`)) {
                return shortenPostDescription(text.substring(0, text.lastIndexOf(' ')) + '…')
            } else {
                return postTitle + `\r\n ${text.substring(0, text.lastIndexOf(' '))}` + '…' + `\r\n ${link}` + `\r\n ${hashtagString}`
            }
        }

        if (checkLength(postTitle + `\r\n ${postDescription}` + `\r\n ${link}` + `\r\n ${hashtagString}`))
            return (postTitle + `\r\n ${postDescription}` + `\r\n ${link}` + `\r\n ${hashtagString}`).split('\r\n')
        else
            return shortenPostDescription(postDescription).split('\r\n')

    }


    useEffect(() => {
        let postList = getPostList().then((posts): Post[] => posts);

        postList.then(res => {
            setPostListItems(res.map((post, i) => <li key={i}>{
                checkAndModifyPostText(post.description, post.title, post.link, post.categories).map(s=><><>{s}<br /></><br /></>)}<hr /></li>))
            setState('success')
        })

    }, [])



    return (
        <ul style={{listStyle: 'none'}}>{state === 'success' ? postListItems : <>Loading...</>}</ul>
    )
}

type Post = {
    'title': string,
    'description': string,
    'link': string,
    'categories': Category[]
}
type Category = string;