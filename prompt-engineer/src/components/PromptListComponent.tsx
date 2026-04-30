import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { allPrompts, allProperties, deletePrompt, newOutput, allPropertiesForPrompts } from "../services/apiService";
import { type Prompt } from "../../types/prompt";
import { type PropertiesForPrompt } from "../../types/propertyConnection"
import { type Property } from "../../types/property";

interface Props {
    onSelect: (text: string) => void;
}

function PromptListComponent({ onSelect }: Props) {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [propertiesForPrompt, setPropertiesForPrompt] = useState<PropertiesForPrompt[]>([]);
    const [property, setProperty] = useState<Property[]>([]);

    useEffect(() => {
        fetchPrompts();
        window.addEventListener("prompt-created", fetchPrompts);
        return () => window.removeEventListener("prompt-created", fetchPrompts);
    }, []);

    async function fetchPrompts() {
        try {
            setPrompts(await allPrompts());
            setProperty( await allProperties())
            setPropertiesForPrompt( await allPropertiesForPrompts())
        } catch (error) {
            console.error("Failed to fetch prompts:", error);
        } finally {
            setLoading(false);
        }
    }
    
    async function handleDelete(id: number) {
        const err = await deletePrompt(String(id));
        if (!err) {
            fetchPrompts()
        } else {
            alert("Delete the outputs connected to this prompt before you delete it")
        }
    }

    function handleProperties(promptId: number): Property[]{
        const connections = propertiesForPrompt.filter((p) => p.prompt_id === promptId);
        if (connections.length === 0) { 
            return [{ id: 1, tag: "No tags picked" }]
        }
        return connections
            .map((conn) => property.find((prop) => prop.id === conn.property_id))
            .filter((prop): prop is Property => prop !== undefined);
    }

    function handleAssign(systemPromptId: number, userPromptId: number) {
        setAssignments((prev) => ({ ...prev, [systemPromptId]: userPromptId }));
    }

   async function handleSubmit(systemPrompt: string, userPrompt: string, systemPromptID: number, userPromptID: number ) {
        setSubmitting(systemPrompt);
        if (!userPrompt && !userPromptID) {
            alert("No user prompt selected")
        }
        const err = await newOutput(systemPrompt, userPrompt, systemPromptID, userPromptID);
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
                    <div>
                        Tags: {handleProperties(systemPrompt.id).map((prop) => (
                            <li key={prop.id}>{prop.tag} </li>
                        ))}
                    </div>
                    <p
                        onClick={() => onSelect(systemPrompt.text)}
                        style={{ cursor: "pointer", margin: 0 }}
                    >
                        {systemPrompt.title}
                    </p>

                    <select
                        value={assignments[systemPrompt.id] ?? ""}
                        onChange={(e) => handleAssign(systemPrompt.id, Number(e.target.value))}
                        >
                        <option value="" disabled>Choose User Prompt</option>
                        {userPrompts.map((userPrompt) => (
                            <option key={userPrompt.id} value={userPrompt.id}>
                                {(userPrompt.title === "Untitled" ? " Id: " + String(userPrompt.id) : userPrompt.title)}
                            </option>
                        ))}
                    </select>

                    
                    <Link to={"/prompts/edit/" + systemPrompt.id}>Edit</Link>
                    <button className="deleteButtton" onClick={() => handleDelete(systemPrompt.id)}>Delete</button>
                    <button onClick={() => handleSubmit(systemPrompt.text, 
                        userPrompts.find((p) => p.id === assignments[systemPrompt.id])?.text || "", 
                        systemPrompt.id, userPrompts.find((p) => p.id === assignments[systemPrompt.id])?.id)}>
                        {submitting === systemPrompt.text ? "Loading..." : "Submit"}
                    </button>
                </div>
            ))}
        </>
    );
}

export default PromptListComponent;
