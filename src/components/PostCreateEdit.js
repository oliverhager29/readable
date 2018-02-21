import React, { Component } from 'react';
import * as ReadableAPI from "../utils/ReadableAPI";
import {connect} from "react-redux";
import {
    addPostAction,
    updatePostAction
} from "../actions";

class PostCreateEdit extends Component {
    state = {
        id: null,
        title: "",
        body: "",
        author: "",
        category: ""
    }

    constructor(props) {
        super(props)
        const {postId, posts} = this.props
        if(postId!=null) {
            this._title = posts.byId[postId].title
            this._body = posts.byId[postId].body
            this._author = posts.byId[postId].author
            this._category = posts.byId[postId].category
        }
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
    }

    handleSaveClick() {
        const title = this._title.value
        const body = this._body.value
        const author = this._author.value
        const category = this._category.value
        const {closeModal, actions} = this.props
        if(this.state.id===null) {
            const newId=ReadableAPI.getId()
            const now = Date.now()
            ReadableAPI.createPost(
                {
                    id: newId,
                    title: title,
                    body: body,
                    author: author,
                    category: category,
                    timestamp: now
                }).then(
                    (post) => {
                        this.setState({
                                id: newId,
                                title: title,
                                body: body,
                                author: author,
                                category: category
                        }
                        )
                        actions.addPostProp({
                            id: newId,
                            title: title,
                            body: body,
                            author: author,
                            category: category,
                            timestamp: Date.now(),
                            voteScore: 0,
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
            ReadableAPI.updatePost(
                {
                    id: this.state.id,
                    title: title,
                    body: body
                }).then(
                    (post) => {
                        this.setState({
                                id: post.id,
                                title: post.title,
                                body: post.body,
                                author: post.author,
                                category: post.category
                            }
                        )
                        actions.updatePostProp({
                            id: post.id,
                            title: post.title,
                            body: post.body,
                            author: post.author,
                            category: post.category,
                            timestamp: post.timestamp})
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
        const {closeModal, postId, posts} = this.props
        if(postId!=null) {
            this._title = posts.byId[postId].title
            this._body = posts.byId[postId].body
            this._author = posts.byId[postId].author
            this._category = posts.byId[postId].category
        }
        else {
            this._title = this.state.title
            this._body = this.state.body
            this._author = this.state.author
            this._category = this.state.category
        }
        this.setState({
            closeModal: closeModal==null?null:closeModal,
            id: postId==null?null:postId,
            title: postId==null?"":posts.byId[postId].title,
            body: postId==null?"":posts.byId[postId].body,
            author: postId==null?"":posts.byId[postId].author,
            category: postId==null?"":posts.byId[postId].category
        })
    }

    render() {
        const {categories} = this.props
        return (
            <div className="form" id="postCreateEdit">
            <fieldset title={this.state.id===null?"Create Post":"Modify Post"}>
                <label className="field-label">Title:</label><input className="field" type="text" minLength="255" maxLength="255" ref={input => this._title = input} defaultValue={this._title}/><br/>
                <label className="field-label">Body:</label><textarea rows={4} cols={80} className="field" type="text" minLength="255" maxLength="255" ref={input => this._body = input} defaultValue={this._body}/><br/>
                <div>
                {this.state.id===null?(
                    <div>
                <label className="field-label">Author:</label><input className="field" type="text" minLength="60" maxLength="60" ref={input => this._author = input} defaultValue={this._author}/><br/>
                <label className="field-label">Category:</label>
                <select className="select" ref={input => this._category = input} defaultValue={this._category}>
                    {categories.map(function (category, index) {
                        return (
                            <option key={category.name} defaultValue={category.path}>{category.name}</option>
                        )
                    })}
                </select><br/>
                    </div>
                    ):(
                        <div>
                    <label className="field-label">Author:</label><input readOnly={true} className="field" type="text" minLength="60" maxLength="60"  ref={input => this._author = input} defaultValue={this._author}/><br/>
                    <label className="field-label">Category:</label><input readOnly={true} className="field" type="text" minLength="60" maxLength="60" ref={input => this._category = input} defaultValue={this._category}/><br/>
                        </div>
                    )}
                </div>
                <button className="button" onClick={this.handleCloseClick}>Close</button>
                <button className="button" onClick={this.handleSaveClick}>Save</button>
            </fieldset>
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
            updatePostProp: (data) => dispatch(updatePostAction(data))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostCreateEdit)