import { allProperties, newPrompt } from "../services/apiService";
import { useRef, useState, useEffect } from "react";
import { type Property } from "../../types/property";

interface Props {
    prompt: string;
    setPrompt: (value: string) => void;
}

function PromptInputComponent({ prompt, setPrompt}: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    
    useEffect(() => {
        allProperties().then(setProperties);
    }, []);

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
        const title = formData.get("title") || "Untitled";
        if (value === null || typeof value !== "string" || value.trim() === "") {
            alert("Prompt cannot be empty!");
            return;
        }
        const error = await newPrompt(value, type, title);
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

            <input type="text" name="title" placeholder="Title..." className="prompt-title" />
            
            <select name="type" className="prompt-type">
                <option value="system">System</option>
                <option value="user">User</option>
            </select>
            <select name="property" className="prompt-property">
            {properties.map((property) => (
                <option key={property.id} value={property.id}>
                    {(property.tag === "Untitled" ? " Id: " + String(property.id) : property.tag)}
                </option>
            ))}
            </select>
            <button type="submit">Submit</button>
        </form>
    );
}

export default PromptInputComponent;