import {useEffect, useState} from "react";

const getPostList = async (): Promise<Post[]> => {
    const postList = await fetch('./api/twitter-posting');

    return postList.json();
}


export default function PostList() {
    const [state, setState] = useState('loading');
    const [postListItems, setPostListItems] = useState<JSX.Element[]>([<></>])


    useEffect(() => {
        let postList = getPostList().then((posts): Post[] => posts);
        postList.then(res => {
            setPostListItems(res.map((post, i) => <li key={i}>`🚺 ${post.title} 🚺\\n\\n` + `${post.link}`</li>))
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