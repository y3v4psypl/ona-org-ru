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

        let postText = `🚺 ${title.replaceAll('&laquo;', '«').replaceAll('&raquo;', '»')} 🚺 \r\n`
            + description.replaceAll(/<div[^>]*>(.+)<\/div>/gmi, '')
                .replaceAll('&laquo;', '«').replaceAll('&raquo;', '»')
                .replaceAll('<p>','')
                .replaceAll('</p>', '\r\n')
                .replaceAll('<!-- more -->', '')
                .replaceAll(/<a[^>]+>/gmi, '')
                .replaceAll('</a>', '')

        const shortenPostText = (text: string): string => {
            if ((text.substring(0, text.lastIndexOf(' ')) + '…' + `\r\n ${link}`).length > 280) {
                return shortenPostText(text.substring(0, text.lastIndexOf(' ')) + '…')
            } else {
                return text.substring(0, text.lastIndexOf(' ')) + '…' + `\r\n ${link}`
            }
        }

        if (checkLength(postText + `\r\n ${link}` + `\r\n ${hashtagString}`)) { return (postText + `\r\n ${link}` + `\r\n ${hashtagString}`).split('\r\n') }
        else {
            return shortenPostText(postText).split('\r\n')
        }
    }


    useEffect(() => {
        let postList = getPostList().then((posts): Post[] => posts);

        postList.then(res => {
            setPostListItems(res.map((post, i) => <li key={i}>{
                checkAndModifyPostText(post.description, post.title, post.link, post.categories).map(s=><><>{s}<br/></><hr/></>)}</li>))
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