import React, { Component } from 'react'
import CommentCreateEdit from "./CommentCreateEdit"
import PostCreateEdit from "./PostCreateEdit"
import {Link} from 'react-router-dom'
import * as ReadableAPI from "../utils/ReadableAPI"
import {
    addCategoriesAction, addCommentAction, addPostAction, downVoteCommentAction, downVotePostAction,
    removeCommentAction, removePostAction, updateCommentAction,
    updatePostAction,
    upVoteCommentAction,
    upVotePostAction
} from "../actions";
import {connect} from "react-redux";
import Modal from "react-modal";

Modal.setAppElement('#root');

class PostDetails extends Component {

    static contextTypes = {
         router: () => true // replace with PropTypes.object if you use them
    }

    state = {
        isCreateCommentModalOpen: false,
        isEditCommentModalOpen: [],
        isCreatePostModalOpen: false,
        isEditPostModalOpen: false,
    }

    openCreatePostModal() {
        this.setState(() => ({isCreatePostModalOpen: true}))
    }

    closeCreatePostModal(){
        this.setState(() => ({isCreatePostModalOpen: false}))
    }

    openEditPostModal(index) {
        this.setState(() => ({isEditPostModalOpen: true}))
    }

    closeEditPostModal(){
        this.setState(() => ({isEditPostModalOpen: false}))
    }

    handleDownVotePost = (postId, index) => {
        const {actions} = this.props
        ReadableAPI.downVotePost(postId).then(
            (post) => {
                actions.downVotePostProp({id: post.id, voteScore: post.voteScore})
            }
        )
    }

    handleUpVotePost = (postId, index) => {
        const {actions} = this.props
        ReadableAPI.upVotePost(postId).then(
            (post) => {
                actions.upVotePostProp({id: post.id, voteScore: post.voteScore})
            }
        )
    }

    handleDeletePost = (postId, index) => {
        const {actions} = this.props
        ReadableAPI.deletePost(postId).then(
            (post) => {
                actions.removePostProp(post.id)
                this.context.router.history.goBack()
            }
        )
    }

    componentDidMount() {
        const path = this.props.location.pathname
        const postId = path.substring(path.lastIndexOf('/')+1, path.length)
        const post = this.props.posts.byId[postId]
        const comments = this.props.posts.byId[postId].commentIds.map( i => this.props.comments.byId[i]).filter(c => (c.deleted===false && c.parentDeleted===false))
        this.setState(
            {
                post: post,
                comments: comments,
                isSortedByTimestamp: true,
                isSortedByVoteScore: false,
                isAscending: true
            })
    }

    openCreateCommentModal() {
        this.setState(() => ({isCreateCommentModalOpen: true}))
    }

    closeCreateCommentModal(){
        this.setState(() => ({isCreateCommentModalOpen: false}))
    }

    openEditCommentModal(index) {
        const isEditCommentModalOpen = this.state.isEditCommentModalOpen.map(f => false)
        isEditCommentModalOpen[index] = true
        this.setState(() => ({isEditCommentModalOpen: isEditCommentModalOpen}))
    }

    closeEditCommentModal(){
        const isEditCommentModalOpen = this.state.isEditCommentModalOpen.map(f => false)
        this.setState(() => ({isEditCommentModalOpen: isEditCommentModalOpen}))
    }

    handleDownVoteComment = (commentId, index) => {
        const {actions} = this.props
        ReadableAPI.downVoteComment(commentId).then(
            (comment) => {
                actions.downVoteCommentProp({id: comment.id, voteScore: comment.voteScore})
            }
        )
    }

    handleUpVoteComment = (commentId, index) => {
        const {actions} = this.props
        ReadableAPI.upVoteComment(commentId).then(
            (comment) => {
                actions.upVoteCommentProp({id: comment.id, voteScore: comment.voteScore})
            }
        )
    }

    handleDeleteComment = (commentId, index) => {
        const {actions} = this.props
        ReadableAPI.deleteComment(commentId).then(
            (comment) => {
                let commentsCloned=this.state.comments.slice()
                commentsCloned[index] = comment
                this.setState(
                    {
                        comments: commentsCloned
                    })
                actions.removeCommentProp(commentId)
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
        this.openCreateCommentModal = this.openCreateCommentModal.bind(this);
        this.closeCreateCommentModal = this.closeCreateCommentModal.bind(this);
        this.openEditCommentModal = this.openEditCommentModal.bind(this);
        this.closeEditCommentModal = this.closeEditCommentModal.bind(this);

        this.openCreatePostModal = this.openCreatePostModal.bind(this);
        this.closeCreatePostModal = this.closeCreatePostModal.bind(this);
        this.openEditPostModal = this.openEditPostModal.bind(this);
        this.closeEditPostModal = this.closeEditPostModal.bind(this);

        this.handleSortByTimestamp = this.handleSortByTimestamp.bind(this);
        this.handleSortByVoteScore = this.handleSortByVoteScore.bind(this);
    }

    render() {
        const path = this.props.location.pathname
        const postId = path.substring(path.lastIndexOf('/')+1, path.length)
        const post = this.props.posts.byId[postId]
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
        const {isSortedByTimestamp, isSortedByVoteScore, isAscending} = this.state

        const handleDeleteComment = this.handleDeleteComment
        const isEditCommentModalOpen = this.state.isEditCommentModalOpen
        const closeEditCommentModal = this.closeEditCommentModal
        const openEditCommentModal = this.openEditCommentModal
        const handleDownVoteComment = this.handleDownVoteComment
        const handleUpVoteComment = this.handleUpVoteComment

        const handleDeletePost = this.handleDeletePost
        const isEditPostModalOpen = this.state.isEditPostModalOpen
        const closeEditPostModal = this.closeEditPostModal
        const openEditPostModal = this.openEditPostModal
        const handleDownVotePost = this.handleDownVotePost
        const handleUpVotePost = this.handleUpVotePost

        const postDateTime = new Date(post.timestamp)
        const postDateTimeStr=postDateTime.toLocaleString()
        return (
                    <div>
                        <h1>Post Details:</h1>
                        <div className="form" id="postDetails">
                            <table>
                                <tbody>
                                <tr className="table-row-even"><td className="table-column-label"><label className="field-label">Id:</label></td><td className="table-column-value"><label className="field-value">{post.id}</label></td></tr>
                                <tr className="table-row-odd"><td className="table-column-label"><label className="field-label">Timestamp:</label></td><td className="table-column-value"><label className="field-value">{postDateTimeStr}</label></td></tr>
                                <tr className="table-row-even"><td className="table-column-label"><label className="field-label">Title:</label></td><td className="table-column-value"><label className="field-value">{post.title}</label></td></tr>
                                <tr className="table-row-odd"><td className="table-column-label"><label className="field-label">Body:</label></td><td className="table-column-value"><label className="field-value">{post.body}</label></td></tr>
                                <tr className="table-row-even"><td className="table-column-label"><label className="field-label">Author:</label></td><td className="table-column-value"><label className="field-value">{post.author}</label></td></tr>
                                <tr className="table-row-odd"><td className="table-column-label"><label className="field-label">Category:</label></td><td className="table-column-value"><label className="field-value">{post.author}</label></td></tr>
                                <tr className="table-row-even"><td className="table-column-label"><label className="field-label">Vote Score:</label></td><td className="table-column-value"><label className="field-value">{post.voteScore}</label></td></tr>
                                <tr className="table-row-odd"><td className="table-column-label"><label className="field-label">Comment Count:</label></td><td className="table-column-value"><label className="field-value">{post.commentCount}</label></td></tr>
                                </tbody>
                            </table>
                            <table>
                                <tr>
                                    <td><button onClick={() => handleDeletePost(post.id)} name="Delete">Delete</button></td>
                                    <td><button onClick={() => handleDownVotePost(post.id)} name="Vote Down">Vote Down</button></td>
                                    <td><button onClick={() => handleUpVotePost(post.id)} name="Vote Up">Vote Up</button></td>
                                    <td>
                                        <button
                                            className='button'
                                            onClick={() => openEditPostModal()}>
                                            Edit
                                        </button>
                                        <div>
                                            <Modal
                                                className='modal'
                                                overlayClassName='overlay'
                                                isOpen={isEditPostModalOpen}
                                                onRequestClose={closeEditPostModal}
                                                contentLabel='Edit Post'
                                                backdropColor = {'white'}
                                                backdropOpacity = {1}
                                                animationIn={'slideInLeft'}
                                                animationOut={'slideOutRight'}
                                            >
                                                {isEditPostModalOpen && <PostCreateEdit closeModal={closeEditPostModal} postId={post.id}/>}
                                            </Modal>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div id="commentsForPost">
                            <h1>Comments:</h1>
                            <table>
                                <thead className="table-header">
                                    <tr>
                                        <th>Id</th>
                                        <th>Timestamp<button><img height='20' width='20' src={(isSortedByTimestamp?(isAscending?'../sort-up.svg':'../sort-down.svg'):'../sort-arrows-couple-pointing-up-and-down.svg')} alt="sort by timestamp" onClick={this.handleSortByTimestamp} /></button></th>
                                        <th>Body</th>
                                        <th>Author</th>
                                        <th>Vote Score<button><img height='20' width='20' src={(isSortedByVoteScore?(isAscending?'../sort-up.svg':'../sort-down.svg'):'../sort-arrows-couple-pointing-up-and-down.svg')} alt="sort by vote score" onClick={this.handleSortByVoteScore} /></button></th>
                                        <th>Down Vote</th>
                                        <th>Up Vote</th>
                                        <th>Delete</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {(comments===null || comments.allIds==null || comments.allIds.length===0 || post===null || post.commentCount===0) ?
                                    <tr><td colSpan={12}>no comments available</td></tr>
                                    :comments.allIds.map(commentId => comments.byId[commentId] )
                                        .filter(comment => comment.deleted===false)
                                        .filter(comment => comment.parentId===postId)
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
                                        .map(function (comment, index) {
                                    const commentDateTime = new Date(comment.timestamp)
                                    const commentDateTimeStr=commentDateTime.toLocaleString()
                                    return (
                                        <tr className={index%2===0?"table-row-even":"table-row-odd"} key={comment.id}>
                                            <td>{comment.id}</td>
                                            <td>{commentDateTimeStr}</td>
                                            <td>{comment.body}</td>
                                            <td>{comment.author}</td>
                                            <td>{comment.voteScore}</td>
                                            <td><button onClick={() => handleDownVoteComment(comment.id, index)} name="Vote Down">Vote Down</button></td>
                                            <td><button onClick={() => handleUpVoteComment(comment.id, index)} name="Vote Up">Vote Up</button></td>
                                            <td><button onClick={() => handleDeleteComment(comment.id, index)} name="Delete">Delete</button></td>
                                            <td>
                                                <button
                                                    className='button'
                                                    onClick={() => openEditCommentModal(index)}>
                                                    Edit
                                                </button>
                                                <div>
                                                    <Modal
                                                        className='modal'
                                                        overlayClassName='overlay'
                                                        isOpen={isEditCommentModalOpen[index]}
                                                        onRequestClose={closeEditCommentModal}
                                                        contentLabel='Edit Comment'
                                                        backdropColor = {'white'}
                                                        backdropOpacity = {1}
                                                        animationIn={'slideInLeft'}
                                                        animationOut={'slideOutRight'}
                                                    >
                                                        {isEditCommentModalOpen[index] && <CommentCreateEdit closeModal={closeEditCommentModal} commentId={comment.id}/>}
                                                    </Modal>
                                                </div>
                                            </td>
                                        </tr>
                                        )})}
                                </tbody>
                            </table>
                        </div>
                        <div id="addComment">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <button
                                            className="button"
                                            onClick={this.context.router.history.goBack}>
                                            Back
                                        </button>
                                    </td>
                                    <td>
                                        <Link to={{
                                            pathname: '/'
                                        }}>
                                            Home
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            className='button'
                                            onClick={() => this.openCreateCommentModal()}>
                                            Create
                                        </button>
                                        <div>
                                            <Modal
                                                className='modal'
                                                overlayClassName='overlay'
                                                isOpen={this.state.isCreateCommentModalOpen}
                                                onRequestClose={this.closeCreateCommentModal}
                                                contentLabel='Create Comment'
                                                backdropColor = {'white'}
                                                backdropOpacity = {1}
                                                animationIn={'slideInLeft'}
                                                animationOut={'slideOutRight'}
                                            >
                                                {this.state.isCreateCommentModalOpen && <CommentCreateEdit closeModal={this.closeCreateCommentModal} parentId={post.id}/>}
                                            </Modal>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
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
)(PostDetails)