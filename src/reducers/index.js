import {
    ADD_POST,
    UPDATE_POST,
    REMOVE_POST,
    UP_VOTE_POST,
    DOWN_VOTE_POST,
    ADD_COMMENT,
    UPDATE_COMMENT,
    REMOVE_COMMENT,
    UP_VOTE_COMMENT,
    DOWN_VOTE_COMMENT,
    ADD_CATEGORIES
} from '../actions'
import { combineReducers } from 'redux';

const initialState = {
    categories: [],
    posts: {
        byId: {

        },
        byCategory: {

        },
        allIds: []
    },
    comments: {
        byId: {

        },
        allIds: []
    }
}

export function addPost(state=initialState, action) {
    if(action.type!==ADD_POST) {
        return state
    }
    let {id, title, body, author, category, timestamp, voteScore, deleted} = action
    let postIdsByCategory = state.posts.byCategory[category]
    if(postIdsByCategory==null) {
        postIdsByCategory = []
    }
    if(voteScore===null) {
        voteScore = 0
    }
    if(deleted===null) {
        deleted = false
    }
    const newPostIdsByCategory = postIdsByCategory.concat([id])
    const allPostIds = state.posts.allIds
    const newAllPostIds = allPostIds.concat([id])
    return {
        ...state,
        posts: {
            byId: {
                [id]: {
                    id,
                    title,
                    body,
                    author,
                    category,
                    timestamp,
                    voteScore,
                    deleted,
                    commentCount: 0,
                    commentIds: []
                },
                ...state.posts.byId
            },
            byCategory: {
                ...state.posts.byCategory,
                [category]: newPostIdsByCategory
            },
            allIds: newAllPostIds
        }
    }
}

export function updatePost(state=initialState, action) {
    if(action.type!==UPDATE_POST) {
        return state
    }
    const {id, title, body, author, category, timestamp} = action
    let postIdsByCategory = state.posts.byCategory[category]
    if(postIdsByCategory==null) {
        postIdsByCategory = []
    }
    const post = state.posts.byId[id]
    const allPostIds = state.posts.allIds
    let postCommentIds = post.commentIds
    if(postCommentIds==null) {
        postCommentIds = []
    }
    return {
        ...state,
        posts: {
            byId: {
                ...state.posts.byId,
                [id]: {
                    id,
                    title,
                    body,
                    author,
                    category,
                    timestamp,
                    commentIds: postCommentIds,
                    voteScore: post.voteScore,
                    deleted: post.deleted,
                    commentCount: post.commentCount
                }
            },
            byCategory: {
                ...state.posts.byCategory,
                [category]: postIdsByCategory
            },
            allIds: allPostIds
        }
    }
}

export function removePost(state=initialState, action) {
    if(action.type!==REMOVE_POST) {
        return state
    }
    const {id, category} = state.posts.byId[action.id]
    const postIdsByCategory = state.posts.byCategory[category]
    const newPostIdsByCategory = postIdsByCategory.filter(e => e!==id)
    const allPostIds = state.posts.allIds
    const newAllPostIds = allPostIds.filter(e => e!==id)
    const newCommentsById = Object.keys(state.comments.byId).map(
        k => state.comments.byId[k]
    ).filter(
        c => c.parentId!==id
    )
    const newAllCommentIds = Object.keys(newCommentsById).map(c => c.id)
    return {
        ...state,
        posts: {
            byId: {
                ...state.posts.byId,
                [id]: null
            },
            byCategory: {
                ...state.posts.byCategory,
                [category]: newPostIdsByCategory
            },
            allIds: newAllPostIds
        },
        comments: {
            byId: newCommentsById,
            allIds: newAllCommentIds
        }
    }
}

export function upVotePost(state=initialState, action) {
    if(action.type!==UP_VOTE_POST) {
        return state
    }
    const {id, voteScore} = action
    const post = state.posts.byId[id]
    const postIdsByCategory = state.posts.byCategory[post.category]
    const allPostIds = state.posts.allIds
    return {
        ...state,
        posts: {
            byId: {
                ...state.posts.byId,
                [id]: {
                    id,
                    title: post.title,
                    body: post.body,
                    author: post.author,
                    category: post.category,
                    timestamp: post.timestamp,
                    commentIds: post.commentIds,
                    voteScore: voteScore,
                    deleted: post.deleted,
                    commentCount: post.commentCount
                }
            },
            byCategory: {
                ...state.posts.byCategory,
                [post.category]: postIdsByCategory
            },
            allIds: allPostIds
        }
    }
}

export function downVotePost(state=initialState, action) {
    if(action.type!==DOWN_VOTE_POST) {
        return state
    }
    const {id, voteScore} = action
    const post = state.posts.byId[id]
    const postIdsByCategory = state.posts.byCategory[post.category]
    const allPostIds = state.posts.allIds
    return {
        ...state,
        posts: {
            byId: {
                ...state.posts.byId,
                [id]: {
                    id,
                    title: post.title,
                    body: post.body,
                    author: post.author,
                    category: post.category,
                    timestamp: post.timestamp,
                    commentIds: post.commentIds,
                    voteScore: voteScore,
                    deleted: post.deleted,
                    commentCount: post.commentCount
                }
            },
            byCategory: {
                ...state.posts.byCategory,
                [post.category]: postIdsByCategory
            },
            allIds: allPostIds
        }
    }
}

export function addComment(state=initialState, action) {
    if(action.type!==ADD_COMMENT) {
        return state
    }
    let {id, timestamp, voteScore, deleted, parentDeleted, body, author, parentId} = action
    const post = state.posts.byId[parentId]
    if(post==null) {
        return state
    }
    if(voteScore===null) {
        voteScore = 0
    }
    if(deleted===null) {
        deleted = false
    }
    if(parentDeleted===null) {
        parentDeleted = false
    }
    const allCommentIds = state.comments.allIds
    const newAllCommandIds = allCommentIds.concat([id])

    let allCommentIdsByPost = []
    if(post!=null && post.commentIds!=null) {
        allCommentIdsByPost = post.commentIds
    }
    const newAllCommentIdsByPost = allCommentIdsByPost.concat([id])

    return {
        ...state,
        posts: {
            ...state.posts,
            byId: {
                ...state.posts.byId,
                [post.id]: {
                    id: post.id,
                    title: post.title,
                    body: post.body,
                    author: post.author,
                    category: post.category,
                    timestamp: post.timestamp,
                    commentIds: newAllCommentIdsByPost,
                    voteScore: post.voteScore,
                    commentCount: newAllCommentIdsByPost.length,
                    deleted: post.deleted
                }
            }
        },
        comments: {
            byId: {
                ...state.comments.byId,
                [id]: {
                    id: id,
                    timestamp: timestamp,
                    body: body,
                    author: author,
                    parentId: parentId,
                    voteScore: voteScore,
                    deleted: deleted,
                    parentDeleted: parentDeleted
                }
            },
            allIds: newAllCommandIds
        }
    }
}

export function updateComment(state=initialState, action) {
    if(action.type!==UPDATE_COMMENT) {
        return state
    }
    const {	id, timestamp, body} = action
    const comment = state.comments.byId[id]
    const allCommentIds = state.comments.allIds
    return {
        ...state,
        comments: {
            byId: {
                ...state.comments.byId,
                [id]: {
                    id: id,
                    timestamp: timestamp,
                    body: body,
                    author: comment.author,
                    parentId: comment.parentId,
                    voteScore: comment.voteScore,
                    deleted: comment.deleted,
                    parentDeleted: comment.parentDeleted
                }
            },
            allIds: allCommentIds
        }
    }
}

export function removeComment(state=initialState, action) {
    if(action.type!==REMOVE_COMMENT) {
        return state
    }
    const {	id, parentId} = state.comments.byId[action.id]
    const newCommentsByPost = state.posts.byId[parentId].commentIds.filter(c => c!==id)
    const newAllCommentIds = state.comments.allIds.filter(c => c!==id)
    const post = state.posts.byId[parentId]
    const postIdsByCategory = state.posts.byCategory
    const allPostIds = state.posts.allIds
    return {
        ...state,
        posts: {
            byId: {
                ...state.posts.byId,
                [post.id]: {
                    id: post.id,
                    title: post.title,
                    body: post.body,
                    author: post.author,
                    category: post.category,
                    timestamp: post.timestamp,
                    commentIds: newCommentsByPost,
                    voteScore: post.voteScore,
                    commentCount: newCommentsByPost.length,
                    deleted: post.deleted
                }
            },
            byCategory: {
                postIdsByCategory
            },
            allIds: allPostIds
        },
        comments: {
            byId: {
                ...state.comments.byId,
                [id]: null
            },
            allIds: newAllCommentIds
        }
    }
}

export function upVoteComment(state=initialState, action) {
    if(action.type!==UP_VOTE_COMMENT) {
        return state
    }
    const {id, voteScore} = action
    const comment = state.comments.byId[id]
    const allCommentIds = state.comments.allIds
    return {
        ...state,
        comments: {
            byId: {
                ...state.comments.byId,
                [id]: {
                    id: id,
                    timestamp: comment.timestamp,
                    body: comment.body,
                    author: comment.author,
                    parentId: comment.parentId,
                    voteScore: voteScore,
                    deleted: comment.deleted,
                    parentDeleted: comment.parentDeleted
                }
            },
            allIds: allCommentIds
        }
    }
}

export function downVoteComment(state=initialState, action) {
    if(action.type!==DOWN_VOTE_COMMENT) {
        return state
    }
    const {id, voteScore} = action
    const comment = state.comments.byId[id]
    const allCommentIds = state.comments.allIds
    return {
        ...state,
        comments: {
            byId: {
                ...state.comments.byId,
                [id]: {
                    id: id,
                    timestamp: comment.timestamp,
                    body: comment.body,
                    author: comment.author,
                    parentId: comment.parentId,
                    voteScore: voteScore,
                    deleted: comment.deleted,
                    parentDeleted: comment.parentDeleted
                }
            },
            allIds: allCommentIds
        }
    }
}

export function addCategories(state=initialState, action) {
    if(action.type!==ADD_CATEGORIES) {
        return state
    }
    const categories = action.categories
    return {
        ...state,
        categories: categories
    }
}

// function getCommentsByPost(state=initialState, action) {
//     return state.posts.byId[action.id].commentIds.map(i => state.comments.byId[i]);
// }

// function getAllPosts(state=initialState, action) {
//     return state.posts.allIds.map(i => state.posts.byId[i]);
// }

// function getPostsByCategory(state=initialState, action) {
//     return state.posts.byCategory[action.category].map(i => state.posts.byId[i]);
// }
//
// function getPostById(state=initialState, action) {
//     return state.posts.byId[action.id];
// }
//
// function getAllCategories(state=initialState, action) {
//     return state.categories.map(c => c.name)
// }


function forum(state = initialState, action) {
    switch(action.type) {
        case ADD_POST :
            return addPost(state, action)
        case UPDATE_POST :
            return updatePost(state, action)
        case REMOVE_POST :
            return removePost(state, action)
        case UP_VOTE_POST :
            return upVotePost(state, action)
        case DOWN_VOTE_POST :
            return downVotePost(state, action)
        case ADD_COMMENT :
            return addComment(state, action)
        case UPDATE_COMMENT :
            return updateComment(state, action)
        case REMOVE_COMMENT :
            return removeComment(state, action)
        case UP_VOTE_COMMENT :
            return upVoteComment(state, action)
        case DOWN_VOTE_COMMENT :
            return downVoteComment(state, action)
        case ADD_CATEGORIES :
            return addCategories(state, action)
        default :
            return state
    }
}
export default combineReducers({
    forum
})