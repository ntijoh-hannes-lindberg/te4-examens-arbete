import { newPrompt } from "../services/apiService";
import { useRef } from "react";

interface Props {
    prompt: string;
    setPrompt: (value: string) => void;
}

function PromptInputComponent({ prompt, setPrompt }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setPrompt(e.target.value);
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    }

    async function handleSubmit(formData: FormData) {
        const value = formData.get("query");
        const type = formData.get("type") || "system";
        if (value === null || typeof value !== "string" || value.trim() === "") {
            alert("Prompt cannot be empty!");
            return;
        }
        const error = await newPrompt(value, type);
        setPrompt("");
        if (error) {
            alert(error);
        }
        window.dispatchEvent(new CustomEvent("prompt-created"));
    }

    return (
        <form action={handleSubmit}>
            <textarea
                ref={textareaRef}
                name="query"
                value={prompt}
                placeholder="Prompt..."
                onChange={handleChange}
                className="prompt-input"
                />
            <select name="type" className="prompt-type">
                <option value="user">User</option>
                <option value="system">System</option>
            </select>
            <button type="submit">Submit</button>
        </form>
    );
}

export default PromptInputComponent;