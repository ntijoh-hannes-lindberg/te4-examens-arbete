import { useState } from 'react';

import { Title } from '../edit/Title';
import { Text } from '../edit/Text';
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
        <Title title={title} setTitle={setTitle} />
        <Text text={text} setText={setText} />
        <button type='submit'>Save</button>
      </form>
    </>
  )
}

export default EditComponent
