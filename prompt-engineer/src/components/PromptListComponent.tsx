import { useEffect, useState } from "react";
import { allPrompts, deletePrompt, newOutput } from "../services/apiService";
import { type Prompt } from "../../types/prompt";

interface Props {
    onSelect: (text: string) => void;
}

function PromptListComponent({ onSelect }: Props) {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState<string | null>(null);

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

    function handleAssign(systemPromptId: number, userPromptId: number) {
        setAssignments((prev) => ({ ...prev, [systemPromptId]: userPromptId }));
    }

   async function handleSubmit(systemPrompt: string, userPrompt: string) {
        setSubmitting(systemPrompt);
        const err = await newOutput(systemPrompt, userPrompt);
        setSubmitting(null);
        if (err) {
            alert(err);
        } else {
            alert("Output created successfully!");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (prompts.length === 0) return <p>No prompts found!</p>;

    const systemPrompts = prompts.filter((p) => p.type === "system");
    const userPrompts = prompts.filter((p) => p.type === "user");

    return (
        <>
            {systemPrompts.map((systemPrompt) => (
                <div key={systemPrompt.id}>
                    <p
                        onClick={() => onSelect(systemPrompt.text)}
                        style={{ cursor: "pointer", margin: 0 }}
                    >
                        {systemPrompt.text}
                    </p>

                 <select
                    value={assignments[systemPrompt.id] ?? ""}
                    onChange={(e) => handleAssign(systemPrompt.id, Number(e.target.value))}
                >
                    <option value="" disabled>Choose User Prompt</option>
                    {userPrompts.map((userPrompt) => (
                        <option key={userPrompt.id} value={userPrompt.id}>
                            {userPrompt.title || " Id: " + String(userPrompt.id)}
                        </option>
                    ))}
                </select>

                    <button onClick={() => handleDelete(systemPrompt.id)}>Delete</button>
                    <button onClick={() => handleSubmit(systemPrompt.text, userPrompts.find((p) => p.id === assignments[systemPrompt.id])?.text || "")}>{submitting === systemPrompt.text ? "Loading..." : "Submit"}</button>
                </div>
            ))}
        </>
    );
}

export default PromptListComponent;