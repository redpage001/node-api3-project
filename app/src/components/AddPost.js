import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AddPost = props => {
    const { posts, setPosts} = props;
    const { id } = useParams();
    const initialState = {
        text: ""
    }
    const [addInput, setAddInput] = useState(initialState)

    const handleChange = e => {
        e.preventDefault();
        setAddInput({
            ...addInput,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(`http://localhost:8000/api/users/${id}/posts`, addInput)
            .then(response => {
                setPosts([
                    ...posts,
                    response.data
                ])
                setAddInput(initialState)
            })
            .catch(error => {
                console.log({error})
            })
    }

    return(
        <form onSubmit={handleSubmit} >
            <input 
                name = "text"
                type = "text"
                value = {addInput.text}
                onChange = {handleChange}
                placeholder = "Text..."
            />
            <button>Add Post</button>
        </form>
    )
}

export default AddPost;