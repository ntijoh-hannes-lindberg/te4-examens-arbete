import { useEffect, useState } from "react";
import { allOutputs, allPrompts, allProperties, allPropertiesForPrompts, deleteOutput } from "../services/apiService";
import { type Output } from "../../types/output";
import { type Prompt } from "../../types/prompt";
import { type Property } from "../../types/property";
import { type PropertiesForPrompt } from "../../types/propertyConnection";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

function OutputListComponent() {
    const [outputs, setOutputs] = useState<Output[]>([]);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertiesForPrompt, setPropertiesForPrompt] = useState<PropertiesForPrompt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchOutputs(),
            fetchPrompts(),
            fetchProperties(),
            fetchPropertiesForPrompts(),
        ]);
    }, []);

    async function handleDelete(id: number) {
        const err = await deleteOutput(String(id));
        if (!err) fetchOutputs();
    }

    async function fetchOutputs() {
        try { setOutputs(await allOutputs()); }
        catch (error) { console.error("Failed to fetch outputs:", error); }
        finally { setLoading(false); }
    }

    async function fetchPrompts() {
        try { setPrompts(await allPrompts()); }
        catch (error) { console.error("Failed to fetch prompts:", error); }
    }

    async function fetchProperties() {
        try { setProperties(await allProperties()); }
        catch (error) { console.error("Failed to fetch properties:", error); }
    }

    async function fetchPropertiesForPrompts() {
        try { setPropertiesForPrompt(await allPropertiesForPrompts()); }
        catch (error) { console.error("Failed to fetch prompt properties:", error); }
    }

    function getTitleForPromptId(promptId: number | null): string | null {
        if (promptId == null) return null;
        return prompts.find((p) => p.id === promptId)?.title ?? null;
    }

    function getTagsForPromptId(promptId: number | null): Property[] {
        if (promptId == null) return [];
        const connections = propertiesForPrompt.filter((p) => p.prompt_id === promptId);
        return connections
            .map((conn) => properties.find((prop) => prop.id === conn.property_id))
            .filter((prop): prop is Property => prop !== undefined);
    }

    if (loading) return <p>Loading...</p>;
    if (outputs.length === 0) return <p>No outputs found!</p>;

    return (
        <>
            {outputs.map((output) => {
                const systemTitle = getTitleForPromptId(output.system_prompt_id);
                const userTitle = getTitleForPromptId(output.user_prompt_id);
                const tags = getTagsForPromptId(output.system_prompt_id);

                return (
                    <div key={output.id}>
                        <h2>Output #{output.id}</h2>

                        <p>
                            <strong>Systemprompt: </strong>
                            {systemTitle
                                ? <Link to={`/prompts/${output.system_prompt_id}`}>{systemTitle}</Link>
                                : <em>Deleted</em>}
                        </p>

                        <p>
                            <strong>Userprompt: </strong>
                            {userTitle
                                ? <Link to={`/prompts/${output.user_prompt_id}`}>{userTitle}</Link>
                                : <em>Deleted</em>}
                        </p>

                        <div>
                            <strong>Properties: </strong>
                            {tags.length > 0
                                ? tags.map((tag) => (
                                    <span key={tag.id} style={{ marginRight: 6 }}>#{tag.tag}</span>
                                ))
                                : <em>No properties</em>}
                        </div>

                        <ReactMarkdown>{output.text}</ReactMarkdown>
                        <button onClick={() => handleDelete(output.id)}>Delete</button>
                    </div>
                );
            })}
        </>
    );
}

export default OutputListComponent;