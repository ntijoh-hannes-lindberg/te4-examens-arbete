import { useEffect, useState } from "react";
import { allPrompts, deletePrompt } from "../services/apiService";
import { type Prompt } from "../../types/prompt";

interface Props {
    onSelect: (text: string) => void;
}

function PromptListComponent({ onSelect }: Props) {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrompts();

        window.addEventListener("prompt-created", fetchPrompts);
        return () => window.removeEventListener("prompt-created", fetchPrompts);
    }, []);

    async function fetchPrompts() {
        try {
            setPrompts(await allPrompts());
        } catch (error) {
            console.error("Failed to fetch prompts:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        const err = await deletePrompt(String(id));
        if (!err) fetchPrompts();
    }

    if (loading) return <p>Loading...</p>;
    if (prompts.length === 0) return <p>No prompts found!</p>;

    return (
        <>
            {prompts.map((prompt) => (
                <div key={prompt.id}>
                    <p
                        onClick={() => onSelect(prompt.text)}
                        style={{ cursor: "pointer" }}
                    >
                        {prompt.text}
                    </p>
                    <button onClick={() => handleDelete(prompt.id)}>Delete</button>
                </div>
            ))}
        </>
    );
}

export default PromptListComponent;