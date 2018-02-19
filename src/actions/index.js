export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const UP_VOTE_POST = 'UP_VOTE_POST'
export const DOWN_VOTE_POST = 'DOWN_VOTE_POST'
export const REMOVE_POST = 'REMOVE_POST'
export const GET_POSTS_BY_CATEGORY = 'GET_POSTS_BY_CATEGORY'
export const ADD_COMMENT = 'ADD_COMMENT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const REMOVE_COMMENT = 'REMOVE_COMMENT'
export const COMMENTS_BY_POST = 'COMMENTS_BY_POST'
export const UP_VOTE_COMMENT = 'UP_VOTE_COMMENT'
export const DOWN_VOTE_COMMENT = 'DOWN_VOTE_COMMENT'
export const ADD_CATEGORIES = 'ADD_CATEGORIES'

export function addPostAction({id, title, body, author, category, timestamp, voteScore, deleted}) {
    return {
        type: ADD_POST,
        id,
        title,
        body,
        author,
        category,
        timestamp,
        voteScore,
        deleted
    }
}

export function updatePostAction({id, title, body, author, category, timestamp}) {
    return {
        type: UPDATE_POST,
        id,
        title,
        body,
        author,
        category,
        timestamp
    }
}

export function upVotePostAction({id, voteScore}) {
    return {
        type: UP_VOTE_POST,
        id,
        voteScore
    }
}

export function downVotePostAction({id, voteScore}) {
    return {
        type: DOWN_VOTE_POST,
        id,
        voteScore
    }
}

export function removePostAction(id) {
    return {
        type: REMOVE_POST,
        id
    }
}

export function getPostsByCategoryAction(category) {
    return {
        type: GET_POSTS_BY_CATEGORY,
        category
    }
}

export function addCommentAction({id, parentId, body, author, timestamp, voteScore, deleted, parentDeleted}) {
    return {
        type: ADD_COMMENT,
        id,
        parentId,
        body,
        author,
        timestamp,
        voteScore,
        deleted,
        parentDeleted
    }
}

export function updateCommentAction({id, body, timestamp}) {
    return {
        type: UPDATE_COMMENT,
        id,
        body,
        timestamp
    }
}

export function removeCommentAction(id) {
    return {
        type: REMOVE_COMMENT,
        id
    }
}

export function getCommentsByPostAction(postId) {
    return {
        type: COMMENTS_BY_POST,
        postId
    }
}

export function upVoteCommentAction({id, voteScore}) {
    return {
        type: UP_VOTE_COMMENT,
        id,
        voteScore
    }
}

export function downVoteCommentAction({id, voteScore}) {
    return {
        type: DOWN_VOTE_COMMENT,
        id,
        voteScore
    }
}

export function addCategoriesAction(categories) {
    return {
        type: ADD_CATEGORIES,
        categories
    }
}