import React, { Component } from 'react';
import * as ReadableAPI from "../utils/ReadableAPI";
import {
    addCommentAction, updateCommentAction
} from "../actions";
import {connect} from "react-redux";
import {getId} from "../utils/ReadableAPI";

class CommentCreateEdit extends Component {
    state = {
        id: "",
        parentId: "",
        body: "",
        author: "",
    }

    constructor(props) {
        super(props)
        const {commentId, comments} = this.props
        if(commentId!=null) {
            this._body = comments.byId[commentId].body
            this._author = comments.byId[commentId].author
        }
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
    }

    handleSaveClick() {
        const body = this._body.value
        const author = this._author.value
        const {closeModal, actions} = this.props

        if(this.state.id===null) {
            const newId=getId()
            ReadableAPI.createComment(
                {
                    id: newId,
                    parentId: this.props.parentId,
                    body: body,
                    author: author,
                    timestamp: Date.now(),
                    voteScore: 0,
                    deleted: false,
                    parentDeleted: false
                }).then(
                    (comment) => {
                        this.setState({
                                id: newId,
                                parentId: this.props.parentId,
                                body: body,
                                author: author,
                                timestamp: comment.timestamp,
                                voteScore: comment.voteScore,
                                deleted: false,
                                parentDeleted: false
                            }
                        )
                        actions.addCommentProp({
                            id: newId,
                            parentId: this.state.parentId,
                            body: body,
                            author: author,
                            timestamp: comment.timestamp,
                            voteScore: comment.voteScore,
                            deleted: false,
                            parentDeleted: false
                        })
                        if(closeModal!=null) {
                            closeModal()
                        }
                    }
            )
        }
        else {
            ReadableAPI.updateComment(
                {
                    id: this.state.id,
                    author: author,
                    body: body,
                    timestamp: Date.now()
                }).then(
                    (comment) => {
                        this.setState({
                            id: this.state.id,
                            parentId: this.props.parentId,
                            body: body,
                            author: author,
                            timestamp: comment.timestamp
                            }
                        )
                        actions.updateCommentProp({
                            id: this.state.id,
                            parentId: this.props.parentId,
                            body: body,
                            author: author,
                            timestamp: comment.timestamp})
                        if(closeModal!=null) {
                            closeModal()
                        }
                    }
                )
        }
    }

    handleCloseClick() {
        const {closeModal} = this.props
        if (closeModal != null) {
            closeModal()
        }
    }

    componentDidMount() {
        const {closeModal, commentId, comments} = this.props
        this._body = this.state.body
        this._author = this.state.author
        this.setState({
            closeModal: closeModal==null?null:closeModal,
            id: commentId==null?null:commentId,
            body: commentId==null?"":comments.byId[commentId].body,
            author: commentId==null?"":comments.byId[commentId].author,
            parentId: commentId==null?"":comments.byId[commentId].parentId,
            timestamp: commentId==null?"":comments.byId[commentId].timestamp
        })
    }

    render() {
        return (

                                   <div className="form" id="commentCreateEdit">
                                       <fieldset title={this.state.id===null?"Create Comment":"Modify Comment"}>
                                       <label className="field-label">Body:</label><textarea rows={4} cols={80} className="field" type="text" minLength="255" maxLength="255"
                                                                                             ref={input => this._body = input} defaultValue={this._body}/><br/>
                                       {this.state.id === null ? (
                                           <div>
                                               <label className="field-label">Author:</label><input className="field" type="text" minLength="60" maxLength="60"
                                                                                                    ref={input => this._author = input} defaultValue={this._author}/><br/>
                                           </div>) : (
                                           <div>
                                               <label className="field-label">Author:</label><input readOnly={true} className="field" type="text" minLength="60" maxLength="60"  ref={input => this._author = input} defaultValue={this._author}/>
                                           </div>
                                       )
                                       }
                                       <button className="button" onClick={this.handleCloseClick}>Close</button>
                                       <button className="button" onClick={this.handleSaveClick}>Save</button>
                                       </fieldset>
                                   </div>
                               )

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
            addCommentProp: (data) => dispatch(addCommentAction(data)),
            updateCommentProp: (data) => dispatch(updateCommentAction(data))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentCreateEdit)