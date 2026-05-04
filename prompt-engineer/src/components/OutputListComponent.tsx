import { useEffect, useState } from "react";
import { allOutputs, deleteOutput, } from "../services/apiService";
import { type Output } from "../../types/output";
import ReactMarkdown from "react-markdown";
import { Link } from 'react-router-dom';

function OutputListComponent() {
    const [outputs, setOutputs] = useState<Output[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOutputs();
        
    }, []);

    async function handleDelete(id: number) {
        const err = await deleteOutput(String(id));
        if (!err) fetchOutputs();
    }

    async function fetchOutputs() {
        try {
            setOutputs(await allOutputs());
        } catch (error) {
            console.error("Failed to fetch outputs:", error);
        } finally {
            setLoading(false);
        }
    }
    if (loading) return <p>Loading...</p>;
    if (outputs.length === 0) return <p>No outputs found!</p>;
   return (
        <>
            {outputs.map((output) => (
                <div key={output.id}>
                    <div key={output.id}>
                        <h1><strong>OutputID: {output.id}</strong></h1>
                        <h1><strong>SystemPromptID: {output.system_prompt_id ? <Link to={"/prompts/" + output.system_prompt_id}>{output.system_prompt_id}</Link> : "Deleted"}</strong></h1>
                        <h1><strong>UserPromptID: <Link to={"/prompts/" + output.user_prompt_id}>{output.user_prompt_id}</Link></strong></h1>
                        <ReactMarkdown>{output.text}</ReactMarkdown>
                        <button onClick={() => handleDelete(output.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </>
    );
}

export default OutputListComponent;