import React, { useContext, useState } from 'react'
import noteContext from "../Context/notes/noteContext"

const AddNote = (props) => {
    const context = useContext(noteContext);
  const {addNote} = context;
  const[note, setNote] = useState({title: "", description: "",tag: ""})

    const handleclick = (e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title: "", description: "",tag: ""})
        props.showAlert("Added successfully","success");
    }
    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }


    return (

        <div>
        <div className="container my-3">
        <h2>Add a Note</h2>
        <form className='my-3'>
            <div class="mb-3">
                <label htmlFor="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required />
                
            </div>
            <div class="mb-3">
                <label htmlFor="description" class="form-label">description</label>
                <input type="text" class="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
            </div>
            <div class="mb-3">
                <label htmlFor="tag" class="form-label">tag</label>
                <input type="text" class="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} minLength={5} required />
            </div>
            <button disabled={note.title.length<5 || note.description.length<5} type="submit" class="btn btn-primary" onClick={handleclick} >Add Note</button>
        </form>
        </div>
        </div>
    )
}

export default AddNote
