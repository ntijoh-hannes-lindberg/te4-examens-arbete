import { TextField } from '../form/TextField'

export function Text({text, setText}) {
    return (
        <TextField state={text} setState={setText} label="Prompt" />
    )
}

export default Text
