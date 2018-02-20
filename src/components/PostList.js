import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import PostCreateEdit from "./PostCreateEdit";
import * as ReadableAPI from "../utils/ReadableAPI";
import {
    addPostAction, removePostAction, updatePostAction, upVotePostAction, downVotePostAction,
    addCommentAction, updateCommentAction, removeCommentAction, upVoteCommentAction, downVoteCommentAction,
    addCategoriesAction
} from '../actions'
import {connect} from "react-redux";

Modal.setAppElement('#root');

class PostList extends Component {
    state = {
        isCreatePostModalOpen: false,
        isEditPostModalOpen: []
    }

    openCreatePostModal() {
        this.setState(() => ({isCreatePostModalOpen: true}))
    }

    closeCreatePostModal(){
        this.setState(() => ({isCreatePostModalOpen: false}))
    }

    openEditPostModal(index) {
        const isEditPostModalOpen = this.state.isEditPostModalOpen.map(f => false)
        isEditPostModalOpen[index] = true
        this.setState(() => ({isEditPostModalOpen: isEditPostModalOpen}))
    }

    closeEditPostModal(){
        const isEditPostModalOpen = this.state.isEditPostModalOpen.map(f => false)
        this.setState(() => ({isEditPostModalOpen: isEditPostModalOpen}))
    }

    handleDownVote = (postId, index) => {
        const {actions} = this.props
        ReadableAPI.downVotePost(postId).then(
            (post) => {
                actions.downVotePostProp({id: post.id, voteScore: post.voteScore})
            }
        )
    }

    handleUpVote = (postId, index) => {
        const {actions} = this.props
        ReadableAPI.upVotePost(postId).then(
            (post) => {
                actions.upVotePostProp({id: post.id, voteScore: post.voteScore})
            }
        )
    }

    handleDelete = (postId, index) => {
        const {actions} = this.props
        ReadableAPI.deletePost(postId).then(
            (post) => {
                actions.removePostProp(post.id)
            }
        )
    }

    constructor(props) {
        super(props)
        this.openCreatePostModal = this.openCreatePostModal.bind(this);
        this.closeCreatePostModal = this.closeCreatePostModal.bind(this);
        this.openEditPostModal = this.openEditPostModal.bind(this);
        this.closeEditPostModal = this.closeEditPostModal.bind(this);
    }

    render() {
        let {actions, categories, posts, comments} = this.props
        if(actions==null) {
            actions = {}
        }
        if(categories==null) {
            categories = []
        }
        if(posts==null) {
            posts = {allIds: [], byId: {}, byCategory: {}}
        }
        if(comments==null) {
            comments = {allIds: [], byId: {}}
        }

        const handleDownVote = this.handleDownVote
        const handleUpVote = this.handleUpVote
        const handleDelete = this.handleDelete
        const isEditPostModalOpen = this.state.isEditPostModalOpen
        const closeEditPostModal = this.closeEditPostModal
        const openEditPostModal = this.openEditPostModal
        return (
                           <div id="main">
                                <div id="categories">
                                    <h1>Posts by Categories:</h1>
                                    <table className="form">
                                        <tbody>
                                        {categories.map(function (category, index) {
                                            return (
                                            <tr key={category.name} >
                                                <td>
                                                    <Link to={{
                                                        pathname: '/'+category.path
                                                    }}>
                                                        View Posts in Category {category.name}
                                                    </Link>
                                                </td>
                                            </tr>
                                                )})}
                                         </tbody>
                                    </table>
                                </div>
                                <div id="allPosts">
                                    <h1>Posts:</h1>
                                    <table>
                                        <thead className={"table-header"}>
                                        <tr>
                                            <th>Id</th>
                                            <th>Timestamp</th>
                                            <th>Title</th>
                                            <th>Body</th>
                                            <th>Author</th>
                                            <th>Category</th>
                                            <th>Vote Score</th>
                                            <th>Comment Count</th>
                                            <th>Delete</th>
                                            <th>Down Vote</th>
                                            <th>Up Vote</th>
                                            <th>Edit Post</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {posts.allIds.map(postId => posts.byId[postId] ).filter(post => post.deleted===false).map(function (post, index) {
                                                    const postId = post.id
                                                    const dateTime = new Date(post.timestamp)
                                                    const dateTimeStr=dateTime.toLocaleString()
                                                    return (
                                                        <tr key={postId} className={index%2===0?"table-row-even":"table-row-odd"}>
                                                            <td>
                                                                <Link to={{
                                                                    pathname: '/'+post.category+'/'+post.id
                                                                }}>
                                                                    {post.id}
                                                                </Link>
                                                            </td>
                                                            <td>{dateTimeStr}</td>
                                                            <td>{post.title}</td>
                                                            <td>{post.body}</td>
                                                            <td>{post.author}</td>
                                                            <td>{post.category}</td>
                                                            <td>{post.voteScore}</td>
                                                            <td>{post.commentCount}</td>
                                                            <td><button onClick={() => handleDelete(post.id, index)} name="Delete">Delete</button></td>
                                                            <td><button onClick={() => handleDownVote(post.id, index)} name="Vote Down">Vote Down</button></td>
                                                            <td><button onClick={() => handleUpVote(post.id, index)} name="Vote Up">Vote Up</button></td>
                                                            <td>
                                                                <button
                                                                    className='button'
                                                                    onClick={() => openEditPostModal(index)}>
                                                                    Edit
                                                                </button>
                                                                <div>
                                                                    <Modal
                                                                        className='modal'
                                                                        overlayClassName='overlay'
                                                                        isOpen={isEditPostModalOpen[index]}
                                                                        onRequestClose={closeEditPostModal}
                                                                        contentLabel='Edit Post'
                                                                        backdropColor = {'white'}
                                                                        backdropOpacity = {1}
                                                                        animationIn={'slideInLeft'}
                                                                        animationOut={'slideOutRight'}
                                                                    >
                                                                        {isEditPostModalOpen[index] && <PostCreateEdit closeModal={closeEditPostModal} postId={post.id}/>}
                                                                    </Modal>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                               <button
                                   className='button'
                                   onClick={() => this.openCreatePostModal()}>
                                   Create
                               </button>
                               <div>
                               <Modal
                                   className='modal'
                                   overlayClassName='overlay'
                                   isOpen={this.state.isCreatePostModalOpen}
                                   onRequestClose={this.closeCreatePostModal}
                                   contentLabel='Create Post'
                                   backdropColor = {'white'}
                                   backdropOpacity = {1}
                                   animationIn={'slideInLeft'}
                                   animationOut={'slideOutRight'}
                               >
                                   {this.state.isCreatePostModalOpen && <PostCreateEdit closeModal={this.closeCreatePostModal}/>}
                               </Modal>
                               </div>
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
)(PostList)
