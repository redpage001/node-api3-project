import React, { useState } from "react";
import axios from "axios";

const AddUser = props => {
    const { users, setUsers } = props;
    const initialState = {
        name: ""
    }
    const [addInputs, setAddInputs] = useState(initialState)

    const handleChange = e => {
        e.preventDefault();
        setAddInputs({
            ...addInputs,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        axios.post(`http://localhost:8000/api/users`, addInputs)
             .then(res => {
                 console.log({ res })
                 setUsers([
                     ...users,
                     res.data
                 ])
                 setAddInputs(initialState)
             })
             .catch(err => {
                 console.log({ err })
             })
    }

    return(
        <form onSubmit={handleSubmit} >
            <input 
                name="name"
                type="text"
                placeholder="Name"
                value={addInputs.name}
                onChange={handleChange}
            />
            <button>Add User</button>
        </form>
    )
}

export default AddUser;
