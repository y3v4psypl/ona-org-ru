

const getPostList = async (): Promise<Post[]> => {
    const postList = await fetch('./api/twitter-posting');

    return postList.json();
}

let postList: Post[];
getPostList().then((posts): Post[] => postList = posts);

export default function PostList() {
    let postListItems = postList.map((post, i) => <li key={i}>`🚺 ${post.title} 🚺\\n\\n` + `${post.link}`</li>)
    return (
        <ul>{postListItems}</ul>
    )
}

type Post = {
    'title': string,
    'description': string,
    'link': string
}