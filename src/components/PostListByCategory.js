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

class PostListByCategory extends Component {

    static contextTypes = {
        router: () => true, // replace with PropTypes.object if you use them
    }

    state = {
        isCreatePostModalOpen: false,
        isEditPostModalOpen: [],
        isSortedByTimestamp: true,
        isSortedByVoteScore: false,
        isAscending: true
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

    handleSortByTimestamp = () => {
        let isAscending = true
        if(this.state.isSortedByTimestamp) {
            isAscending=!this.state.isAscending
        }
        this.setState({isSortedByTimestamp: true, isSortedByVoteScore: false, isAscending: isAscending})
    }

    handleSortByVoteScore = () => {
        let isAscending = true
        if(this.state.isSortedByVoteScore) {
            isAscending=!this.state.isAscending
        }
        this.setState({isSortedByTimestamp: false, isSortedByVoteScore: true, isAscending: isAscending})
    }

    constructor(props) {
        super(props)
        this.openCreatePostModal = this.openCreatePostModal.bind(this);
        this.closeCreatePostModal = this.closeCreatePostModal.bind(this);
        this.openEditPostModal = this.openEditPostModal.bind(this);
        this.closeEditPostModal = this.closeEditPostModal.bind(this);

        this.handleSortByTimestamp = this.handleSortByTimestamp.bind(this);
        this.handleSortByVoteScore = this.handleSortByVoteScore.bind(this);
    }

    render() {
        let {actions, categories, posts, comments} = this.props
        const path = this.props.location.pathname
        const category = path.substring(path.lastIndexOf('/')+1, path.length)
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
        const {isSortedByTimestamp, isSortedByVoteScore, isAscending} = this.state
        const handleDownVote = this.handleDownVote
        const handleUpVote = this.handleUpVote
        const handleDelete = this.handleDelete
        const isEditPostModalOpen = this.state.isEditPostModalOpen
        const closeEditPostModal = this.closeEditPostModal
        const openEditPostModal = this.openEditPostModal
        return (
            <div>
                                <div id="postsByCategory">
                                    <h1>Posts:</h1>
                                    <table>
                                        <thead className={"table-header"}>
                                        <tr>
                                            <th>Id</th>
                                            <th>Timestamp<button><img height='20' width='20' src={(isSortedByTimestamp?(isAscending?'./sort-up.svg':'./sort-down.svg'):'./sort-arrows-couple-pointing-up-and-down.svg')} alt="sort by timestamp" onClick={this.handleSortByTimestamp} /></button></th>
                                            <th>Title</th>
                                            <th>Body</th>
                                            <th>Author</th>
                                            <th>Category</th>
                                            <th>Vote Score<button><img height='20' width='20' src={(isSortedByVoteScore?(isAscending?'./sort-up.svg':'./sort-down.svg'):'./sort-arrows-couple-pointing-up-and-down.svg')} alt="sort by vote score" onClick={this.handleSortByVoteScore} /></button></th>
                                            <th>Comment Count</th>
                                            <th>Delete</th>
                                            <th>Down Vote</th>
                                            <th>Up Vote</th>
                                            <th>Edit Post</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {(posts===null || posts.allIds==null || posts.allIds.length===0 || posts.byCategory==null || posts.byCategory[category]==null || posts.byCategory[category].length===0) ?
                                                <tr><td colSpan={12}>no posts available</td></tr>
                                                :posts.byCategory[category].map(postId => posts.byId[postId] )
                                                    .filter(post => post.deleted===false)
                                                    .sort(function(a,b) {
                                                        if(isSortedByTimestamp) {
                                                            if(isAscending) {
                                                                return a.timestamp - b.timestamp
                                                            }
                                                            else {
                                                                return b.timestamp - a.timestamp
                                                            }
                                                        }
                                                        else if(isSortedByVoteScore) {
                                                            if(isAscending) {
                                                                return a.voteScore - b.voteScore
                                                            }
                                                            else {
                                                                return b.voteScore - a.voteScore
                                                            }
                                                        }
                                                        return 0
                                                    })
                                                    .map(function (post, index) {
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
                                    className="button"
                                    onClick={this.context.router.history.goBack}>
                                    Back
                                </button>
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
)(PostListByCategory)
