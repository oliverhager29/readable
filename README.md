Readable is a React application that implements a forum with posts and comments. Both can be created, deleted, modified and up/down voted. Each posts is assigned to one category. 

The main page consists of links to posts by category and all posts. Each posts entry has a link to post details with their associated comments, an up vote, down vote, edit and delete button. Further there is a create button to create a new post. In the post by catageory posts are displayed in a similar way. The post details page shows the lists of associated comments with up vote, down vote, delete and edit button. There is a also a create button in order to create a new comment. The create/edit posts/comment are implemented as modal dialogs.

In the root component (App) all valid routes are defined. Posts by category have a URL /{category} and post details have a URL /{category}/{post.id}. If post.id is the id of a deleted or non-existant post or  category a non-existant category then a 404 NotFound page is displayed. Same for any other invalid URL.
Further the root component has a Redux store that is propagted into the child components with the action functions.

Redux store model (with sample data):
```i
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
```
Instructions to run:
```
#install latest node js and npm
git clone https://github.com/oliverhager29/readable
cd readable
# installs all necessary node js packages
npm install
cd src
# starts web container with React app
npm start
```
