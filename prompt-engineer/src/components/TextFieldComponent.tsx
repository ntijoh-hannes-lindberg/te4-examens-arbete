import { useState } from "react";
import { newPrompt, sleep } from "../services/apiService";

function TextFieldComponent({ prompt, setPrompt }) {
    const [success, setSuccess] = useState(false);
    async function handleSubmit(formData: FormData) {
        const value = formData.get('query');
        if (value === null || typeof value !== "string" || value.trim() === "") {
            alert("Prompt cannot be empty!");
            return;
        }
        const error = await newPrompt(value)
        setPrompt("")
        if (error) {
            alert(error)
        } else {
            setSuccess(true);
            sleep(2000).then(() => setSuccess(false));
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
            {success && <p>Prompt submitted successfully!</p>}
        </form>
    )
}

export default TextFieldComponent