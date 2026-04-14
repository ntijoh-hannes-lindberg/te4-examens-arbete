import { newPrompt } from "../services/apiService";

function TextFieldComponent({ prompt, setPrompt }) {
    async function handleSubmit(formData: FormData) {
        const value = formData.get('query');
        
        const error = await newPrompt(value)
        if (error) {
            alert(error)
        }
    }

    return (
        <form action={handleSubmit}>
            <input 
                name="query" 
                value={prompt} 
                placeholder="Prompt..." 
                onChange={e => setPrompt(e.target.value)}
            />
            
            <button type="submit">Submit</button>
        </form>
    )
}

export default TextFieldComponent