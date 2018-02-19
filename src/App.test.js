import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { addPost, removePost, updatePost, upVotePost, downVotePost,
    addComment, updateComment, removeComment, upVoteComment, downVoteComment } from '../reducers'
import {ADD_POST, UPDATE_POST, REMOVE_POST, UP_VOTE_POST, DOWN_VOTE_POST,
    ADD_COMMENT, UPDATE_COMMENT, REMOVE_COMMENT, UP_VOTE_COMMENT, DOWN_VOTE_COMMENT} from "../actions";

const initialState = {
    categories: [
        {
            "name": "react",
            "path": "react"
        },
        {
            "name": "redux",
            "path": "redux"
        },
        {
            "name": "udacity",
            "path": "udacity"
        }
    ],
    posts: {
        byId: {
            "8xf0y6ziyjabvozdd253nd": {
                "id": "8xf0y6ziyjabvozdd253nd",
                "timestamp": 1467166872634,
                "title": "Udacity is the best place to learn React",
                "body": "Everyone says so after all.",
                "author": "thingtwo",
                "category": "react",
                "voteScore": 6,
                "deleted": false,
                "commentCount": 2,
                "commentIds": ["894tuq4ut84ut8v4t8wun89g", "8tu4bsun805n8un48ve89"]
            },
            "6ni6ok3ym7mf1p33lnez": {
                "id": "6ni6ok3ym7mf1p33lnez",
                "timestamp": 1468479767190,
                "title": "Learn Redux in 10 minutes!",
                "body": "Just kidding. It takes more than 10 minutes to learn technology.",
                "author": "thingone",
                "category": "redux",
                "voteScore": -5,
                "deleted": false,
                "commentCount": 0,
                "commentIds": []
            }
        },
        byCategory: {
            "react" : ["8xf0y6ziyjabvozdd253nd"],
            "redux" : ["6ni6ok3ym7mf1p33lnez"],
            "udacity" : []
        },
        allIds: ["8xf0y6ziyjabvozdd253nd", "6ni6ok3ym7mf1p33lnez"]
    },
    comments: {
        byId: {
            "894tuq4ut84ut8v4t8wun89g" : {
                "id": "894tuq4ut84ut8v4t8wun89g",
                "parentId": "8xf0y6ziyjabvozdd253nd",
                "timestamp": 1468166872634,
                "body": "Hi there! I am a COMMENT.",
                "author": "thingtwo",
                "voteScore": 6,
                "deleted": false,
                "parentDeleted": false
            },
            "8tu4bsun805n8un48ve89" : {
                "id": "8tu4bsun805n8un48ve89",
                "parentId": "8xf0y6ziyjabvozdd253nd",
                "timestamp": 1469479767190,
                "body": "Comments. Are. Cool.",
                "author": "thingone",
                "voteScore": -5,
                "deleted": false,
                "parentDeleted": false
            }
        },
        allIds: ["894tuq4ut84ut8v4t8wun89g", "8tu4bsun805n8un48ve89"]
    }
}

it('renders without crashing', () => {
    console.log(addPost(initialState, {
        type: "ADD_POST",
        id: "123456789",
        title: "testtitle",
        body: "testbody",
        author: "testauthor",
        category: "udacity",
        timestamp: 1469479767190
    }))

    console.log(updatePost(initialState, {
        type: "UPDATE_POST",
        id: "8xf0y6ziyjabvozdd253nd",
        title: "testtitle",
        body: "testbody",
        author: "thingtwo",
        category: "react",
        timestamp: 1467166872634
    }))

    console.log(removePost(initialState, {
        type: "REMOVE_POST",
        id: "8xf0y6ziyjabvozdd253nd"
    }))

    console.log(upVotePost(initialState, {
        type: "UP_VOTE_POST",
        id: "8xf0y6ziyjabvozdd253nd"
    }))

    console.log(downVotePost(initialState, {
        type: "DOWN_VOTE_POST",
        id: "8xf0y6ziyjabvozdd253nd"
    }))

    console.log(addComment(initialState, {
        type: "ADD_COMMENT",
        id: "91234253",
        timestamp: 1469479767190,
        body: "Body: comment1",
        author: "thingtwo",
        parentId: "8xf0y6ziyjabvozdd253nd",
        voteScore: 0,
        deleted: false,
        parentDeleted: false

    }))

    console.log(updateComment(initialState, {
        type: "UPDATE_COMMENT",
        id: "8tu4bsun805n8un48ve89",
        body: "testbody",
        timestamp: 1469479767190
    }))

    console.log(removeComment(initialState, {
        type: "REMOVE_COMMENT",
        id: "8tu4bsun805n8un48ve89"
    }))

    console.log(upVoteComment(initialState, {
        type: "UP_VOTE_COMMENT",
        id: "8tu4bsun805n8un48ve89"
    }))

    console.log(downVoteComment(initialState, {
        type: "DOWN_VOTE_COMMENT",
        id: "8tu4bsun805n8un48ve89"
    }))
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
