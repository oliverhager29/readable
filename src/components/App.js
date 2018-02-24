import React, { Component } from 'react';
import {Link, BrowserRouter, Route, Switch} from 'react-router-dom'
import { connect } from 'react-redux'
import Loading from 'react-loading'
import '../App.css';
import PostList from './PostList'
import {addPostAction, removePostAction, updatePostAction, upVotePostAction, downVotePostAction,
        addCommentAction, removeCommentAction, updateCommentAction, upVoteCommentAction,
        downVoteCommentAction, addCategoriesAction} from "../actions";
import * as ReadableAPI from "../utils/ReadableAPI";
import PostCreateEdit from "./PostCreateEdit";
import PostListByCategory from "./PostListByCategory";
import PostDetails from "./PostDetails";
import CommentCreateEdit from "./CommentCreateEdit";
const NotFound = () =>
    <div>
        <h3>404 page not found</h3>
        <p>We are sorry but the page you are looking for does not exist.</p>
        <td>
            <Link to={{
                pathname: '/'
            }}>
                Home
            </Link>
        </td>
    </div>

class App extends Component {

    state = {
        loadingData: false
    }

    componentDidMount()  {
        this.readAllPostsHandler()
    }

    readAllPostsHandler() {
        this.setState(
            {
                loadingData: true
            })
        const { actions } = this.props
        ReadableAPI.getAllCategories().then(
            (list) => {
                actions.addCategoriesProp(list)
                ReadableAPI.getAllPosts().then(
                    (posts) => {
                        posts.forEach(p => {
                            actions.addPostProp({
                                    id: p.id, title: p.title, body: p.body, author: p.author,
                                    category: p.category, timestamp: p.timestamp,
                                    voteScore: p.voteScore, deleted: p.deleted
                                })
                                ReadableAPI.getCommentsForPost(p.id).then(
                                    (comments) => {
                                        comments.forEach(c =>
                                            actions.addCommentProp({
                                                id: c.id,
                                                parentId: p.id,
                                                body: c.body,
                                                author: c.author,
                                                timestamp: c.timestamp,
                                                voteScore: p.voteScore,
                                                deleted: p.deleted
                                            })
                                        )
                                        this.setState(
                                            {
                                                loadingData: false
                                            })
                                    }
                                )
                            }
                        )
                    }
                ).finally(   () =>
                    this.setState(
                    {
                        loadingData: false
                    }))
            }
        )
    }

    render() {
        let {categories, posts} = this.props
        if(categories===null || categories.length===0) {
            categories = []
        }
        if(posts===null) {
            posts = {allIds: [], byId: {}, byCategory: {}}
        }
        return (
            <div>
            {this.state.loadingData === true
                ? <Loading delay={200} type='spin' color='#222' className='loading'/>
                :
                <div className="App">
                    <BrowserRouter>
                        <Switch>
                            {categories.map(function (category, index) {
                                const byCategoryPath = '/' + category.path
                                return (
                                    <Route exact path={byCategoryPath} component={PostListByCategory}/>
                                    )})}
                            {posts.allIds.map(postId => posts.byId[postId] ).filter(post => post.deleted===false).map(function (post, index) {
                                const byCategoryPath = '/' + post.category
                                const byPostIdPath = byCategoryPath + '/:postId(' + post.id + ')';
                                return (
                                    <Route exact path={byPostIdPath} component={PostDetails}/>
                            )})}
                            <Route exact path='/postCreateEdit'  component={PostCreateEdit}/>
                            <Route exact path='/commentCreateEdit'  component={CommentCreateEdit}/>
                            <Route exact path="/" component={PostList}/>
                            <Route path="*" status={404} component={NotFound}/>
                        </Switch>
                    </BrowserRouter>
                </div>
            }
            </div>
        );
    }
}

function mapStateToProps ({ forum }) {
    return {
        categories: forum.categories,
        posts: forum.posts,
        comments: forum.comments
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: {
            addPostProp: (data) => dispatch(addPostAction(data)),
            removePostProp: (data) => dispatch(removePostAction(data)),
            updatePostProp: (data) => dispatch(updatePostAction(data)),
            upVotePostProp: (data) => dispatch(upVotePostAction(data)),
            downVotePostProp: (data) => dispatch(downVotePostAction(data)),
            addCommentProp: (data) => dispatch(addCommentAction(data)),
            removeCommentProp: (data) => dispatch(removeCommentAction(data)),
            updateCommentProp: (data) => dispatch(updateCommentAction(data)),
            upVoteCommentProp: (data) => dispatch(upVoteCommentAction(data)),
            downVoteCommentProp: (data) => dispatch(downVoteCommentAction(data)),
            addCategoriesProp: (data) => dispatch(addCategoriesAction(data))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

