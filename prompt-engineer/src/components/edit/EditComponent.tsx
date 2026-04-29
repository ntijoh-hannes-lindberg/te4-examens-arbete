import { useState } from 'react';

import { TextField } from '../form/TextField';
import { updatePrompt } from '../../services/apiService';

export function EditComponent({ prompt, setPrompt }) {
  const [title, setTitle] = useState(prompt.title)
  const [text, setText] = useState(prompt.text)

  async function handleSave() {
    const err = await updatePrompt(prompt.id, title, text, "system")
    if (err) {
      alert(err)
      return
    }

    alert("Saved!")
  }

  return (
    <>
      <form action={handleSave}>
        <TextField state={title} setState={setTitle} label='Title' />
        <TextField state={text} setState={setText} label="Prompt" />
        <button type='submit'>Save</button>
      </form>
    </>
  )
}

export default EditComponent
