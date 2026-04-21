import { useEffect, useState } from "react";
import { allPrompts } from "../services/apiService";
import { type Prompt } from "../../types/prompt"

function CardContainerComponent() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const data: Prompt[] = await allPrompts();
                setPrompts(data);
            } catch (error) {
                console.error("Failed to fetch prompts:", error);
            } finally {
                setLoading(false)
            }
        };
        fetchPrompts();
    }, []);

    if (loading) return <p>Loading...</p>

    return (
        <>
            {prompts.map((prompt) => (
                <p key={prompt.id}>{prompt.text}</p>
            ))}
        </>
    );
}

export default CardContainerComponent;
