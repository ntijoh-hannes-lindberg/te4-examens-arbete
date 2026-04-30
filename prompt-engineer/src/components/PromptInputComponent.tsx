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
    const [selectedType, setSelectedType] = useState<string>("system");
    
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
        const type = formData.get("type");
        const title = formData.get("title");
        const properties = formData.getAll("properties").map((id) => Number(id));
        if (value === null || typeof value !== "string" || value.trim() === "") {
            alert("Prompt cannot be empty!");
            return;
        }
        const typeStr = typeof type === "string" ? type : "system";
        const titleStr = typeof title === "string" ? title : "Untitled";
        const error = await newPrompt(value, typeStr, titleStr, properties);
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
            <select 
                name="type" 
                className="prompt-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
            >
                <option value="system">System</option>
                <option value="user">User</option>
            </select>

            <button type="submit">Submit</button>
            {selectedType === "system" && (
                <>
                    {properties.map((property) => (
                        <li key={property.id}>
                            <input 
                                name="properties" 
                                type="checkbox" 
                                value={property.id}
                            /> 
                            {property.tag}
                        </li>
                    ))}
                </>
            )}
        </form>
    );
}

export default PromptInputComponent;