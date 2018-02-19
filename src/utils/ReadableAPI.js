const api = "http://localhost:3001"
const uuidv4 = require('uuid/v4');
// Generate a unique token for storing your forum data on the backend server.
let token = localStorage.token
if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
    'Accept': 'application/json',
    'Authorization': 'Basic bmFtZTpwYXNzd29yZA=='
}

export const getAllPosts = () =>
    fetch(`${api}/posts`, { headers })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const getAllCategories = () =>
    fetch(`${api}/categories`, { headers })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data.categories)

export const getPostById = (postId) =>
    fetch(`${api}/posts/${postId}`, { headers })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const getPostsForCategory = (category) =>
    fetch(`${api}/${category}/posts`, { headers })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const getCommentById = (commentId) =>
    fetch(`${api}/comments/${commentId}`, { headers })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const getCommentsForPost = (postId) =>
    fetch(`${api}/posts/${postId}/comments`, { headers })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const updatePost = (post) =>
    fetch(`${api}/posts/${post.id}`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const updateComment = (comment) =>
    fetch(`${api}/comments/${comment.id}`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const upVoteComment = (commentId) =>
    fetch(`${api}/comments/${commentId}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'option': 'upVote'})
    }).then(res => res.json())
        .then(data => data)
        .catch(error => console.log(error))

export const downVoteComment = (commentId) =>
    fetch(`${api}/comments/${commentId}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'option': 'downVote'})
    }).then(res => res.json())
        .then(data => data)
        .catch(error => console.log(error))

export const upVotePost = (postId) =>
    fetch(`${api}/posts/${postId}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'option': 'upVote'})
    }).then(res => res.json())
        .then(data => data)
        .catch(error => console.log(error))

export const downVotePost = (postId) =>
    fetch(`${api}/posts/${postId}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'option': 'downVote'})
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const createPost = (post) =>
    fetch(`${api}/posts`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data).catch()

export const createComment = (comment) =>
    fetch(`${api}/comments`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const deletePost = (postId) =>
    fetch(`${api}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export const deleteComment = (commentId) =>
    fetch(`${api}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(data => data)

export function getId() {
    let newId=uuidv4();
    newId=newId.replace(/-/g, "")
    return newId;
}