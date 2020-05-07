import React, { useState } from "react";
import axios from "axios";

const PostCard = props => {
    const { post, posts, setPosts } = props;
    const initialState = { text: "" }
    const [postEditing, setPostEditing] = useState(false);
    const [postInput, setPostInput] = useState(initialState);

    const setEditing = e => {
        e.preventDefault();
        setPostEditing(!postEditing);
        axios.get(`http://localhost:8000/api/posts/${post.id}`)
            .then(response => {
                setPostInput({text: response.data.text})
            })
            .catch(error => {
                console.log({error})
            })
    }

    const handleChange = e => {
        e.preventDefault();
        setPostInput({
            ...postInput,
            [e.target.name]: e.target.value
        })
    }

    const handleEdit = e => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/posts/${post.id}`, postInput)
            .then(response => {
                setPosts([
                    ...posts.map(comment => comment.id === post.id ? response.data : comment)
                ])
            })
            .catch(error => {
                console.log({error})
            })
    }

    const handleDelete = e => {
        e.preventDefault();
        axios.delete(`http://localhost:8000/api/posts/${post.id}`)
            .then(response => {
                setPosts([
                    ...posts.filter(comment => comment.id !== post.id)
                ])
            })
            .catch(error => {
                console.log({error})
            })
    }

    return(
        <>
            <div>
                <h3>{post.text}</h3>
                <button onClick={setEditing}>Edit Post</button>
                <button onClick={handleDelete}>Delete Post</button>
            </div>
            {postEditing && <form onSubmit={handleEdit}>
                                <input 
                                    name = "text"
                                    tpe = "text"
                                    value = {postInput.text}
                                    onChange = {handleChange}
                                    placeholder = "Text..."
                                />
                                <button>Edit Post</button>
                            </form>}
        </>
    )
}

export default PostCard;