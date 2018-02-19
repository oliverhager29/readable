import React, { Component } from 'react'
import CommentCreateEdit from "./CommentCreateEdit"
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
        isEditCommentModalOpen: []
    }

    componentDidMount() {
        const path = this.props.location.pathname
        const postId = path.substring(path.lastIndexOf('/')+1, path.length)
        const post = this.props.posts.byId[postId]
        const comments = this.props.posts.byId[postId].commentIds.map( i => this.props.comments.byId[i]).filter(c => (c.deleted===false && c.parentDeleted===false))
        this.setState(
            {
                post: post,
                comments: comments
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

    handleDownVote = (commentId, index) => {
        const {actions} = this.props
        ReadableAPI.downVoteComment(commentId).then(
            (comment) => {
                actions.downVoteCommentProp({id: comment.id, voteScore: comment.voteScore})
            }
        )
    }

    handleUpVote = (commentId, index) => {
        const {actions} = this.props
        ReadableAPI.upVoteComment(commentId).then(
            (comment) => {
                actions.upVoteCommentProp({id: comment.id, voteScore: comment.voteScore})
            }
        )
    }

    handleDelete = (commentId, index) => {
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

    constructor(props) {
        super(props)
        this.openCreateCommentModal = this.openCreateCommentModal.bind(this);
        this.closeCreateCommentModal = this.closeCreateCommentModal.bind(this);
        this.openEditCommentModal = this.openEditCommentModal.bind(this);
        this.closeEditCommentModal = this.closeEditCommentModal.bind(this);
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
        const handleDelete = this.handleDelete
        const isEditCommentModalOpen = this.state.isEditCommentModalOpen
        const closeEditCommentModal = this.closeEditCommentModal
        const openEditCommentModal = this.openEditCommentModal
        const handleDownVote = this.handleDownVote
        const handleUpVote = this.handleUpVote
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
                        </div>
                        <div id="commentsForPost">
                            <h1>Comments:</h1>
                            <table>
                                <thead className="table-header">
                                    <tr>
                                        <th>Id</th>
                                        <th>Timestamp</th>
                                        <th>Body</th>
                                        <th>Author</th>
                                        <th>Vote Score</th>
                                        <th>Down Vote</th>
                                        <th>Up Vote</th>
                                        <th>Delete</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {comments.allIds.map(commentId => comments.byId[commentId] ).filter(comment => comment.deleted===false).filter(comment => comment.parentId===postId).map(function (comment, index) {
                                    const commentDateTime = new Date(comment.timestamp)
                                    const commentDateTimeStr=commentDateTime.toLocaleString()
                                    return (
                                        <tr className={index%2===0?"table-row-even":"table-row-odd"} key={comment.id}>
                                            <td>{comment.id}</td>
                                            <td>{commentDateTimeStr}</td>
                                            <td>{comment.body}</td>
                                            <td>{comment.author}</td>
                                            <td>{comment.voteScore}</td>
                                            <td><button onClick={() => handleDownVote(comment.id, index)} name="Vote Down">Vote Down</button></td>
                                            <td><button onClick={() => handleUpVote(comment.id, index)} name="Vote Up">Vote Up</button></td>
                                            <td><button onClick={() => handleDelete(comment.id, index)} name="Delete">Delete</button></td>
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