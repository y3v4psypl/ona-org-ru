import {useEffect, useState} from "react";

const getPostList = async (): Promise<Post[]> => {
    const postList = await fetch('./api/twitter-posting');

    return postList.json();
}


export default function PostList() {
    const [state, setState] = useState('loading');
    const [postListItems, setPostListItems] = useState<JSX.Element[]>([<></>])

    const checkAndModifyDescription = (description: string, title: string, link: string): string => {
        const checkLength = (string: string) => string.length <= 280

        const descriptionPremodified = (description: string) => description.slice(description.lastIndexOf('</div>'), description.length - 1)
            .replaceAll('<p>','')
            .replaceAll('</p>', '<br/>')

        if (checkLength(`🚺 ${title} 🚺` + descriptionPremodified(description + link))) return descriptionPremodified(description);
        else {
             return checkAndModifyDescription(descriptionPremodified(description).slice(0, descriptionPremodified(description).lastIndexOf(' ')) + '…', title, link)
        }
    }


    useEffect(() => {
        let postList = getPostList().then((posts): Post[] => posts);

        postList.then(res => {
            setPostListItems(res.map((post, i) => <li key={i}>🚺 {post.title} 🚺<br/>{checkAndModifyDescription(post.description, post.title, post.link)}<br/>{post.link}</li>))
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