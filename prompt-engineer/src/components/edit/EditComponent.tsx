import { Title } from '../edit/Title'
import { Text } from '../edit/Text'

import { useState } from 'react'

export function EditComponent({ prompt, setPrompt }) {
  function handleSave(formData: FormData) {
    const title = formData.get("title")
    const text = formData.get("text")

    prompt.title = title
    prompt.text = text
    setPrompt(prompt)
  }

  return (
    <>
      <form action={handleSave}>
        <Title />
        <Text />
        <button type='submit'>Save</button>
      </form>
    </>
  )
}

export default EditComponent
