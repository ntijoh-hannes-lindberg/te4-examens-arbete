function TextFieldComponent({ prompt, setPrompt }) {
    function handleSubmit(formData: FormData) {
        const value = formData.get('query');
        alert(`Hello, ${value}!`);
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