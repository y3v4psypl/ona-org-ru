

const getPostList = async (): Promise<Post[]> => {
    const postList = await fetch('./api/twitter-posting');

    return postList.json();
}

export default async function PostList() {
    let postList: Post[] = await getPostList();
    let postListItems = postList.map(post => <li key={post.link}>`🚺 ${post.title} 🚺\\n\\n` + `${post.link}`</li>)
    return(
        <ul>{Array(postListItems)}</ul>
    )
}

type Post = {
    'title': string,
    'description': string,
    'link': string
}