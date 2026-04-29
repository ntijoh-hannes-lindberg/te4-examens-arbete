import { TextField } from '../form/TextField'

export function Title({title, setTitle}) {
    return (
        <TextField state={title} setState={setTitle} label='Title' />
    )
}

export default Title