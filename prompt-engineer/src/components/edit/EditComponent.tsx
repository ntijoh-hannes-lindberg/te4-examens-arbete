import { Title } from '../edit/Title'
import { Text } from '../edit/Text'

import { useState } from 'react'
import { updatePrompt } from '../../services/apiService'

export function EditComponent({ prompt, setPrompt }) {
  const [title, setTitle] = useState(prompt.title)
  const [text, setText] = useState(prompt.text)

  function handleSave() {
    updatePrompt(prompt.id, title, text)
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
