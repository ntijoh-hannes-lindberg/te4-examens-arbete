import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getPrompt } from '../services/apiService'
import { EditComponent } from '../components/edit/EditComponent'

function EditPrompts() {
    const [loading, setLoading] = useState(true)
    const [prompt, setPrompt] = useState(null)

    const promptId = useParams().id;
    
    useEffect(() => {
        const controller = new AbortController();

        if (prompt) {
            return () => controller.abort();
        }
        
        const fetchPrompt = async () => {
            const prompt = await getPrompt(promptId)

            setPrompt(prompt)
            setLoading(false)
        }

        fetchPrompt();
        return () => controller.abort();
    });

    if (loading) return <p>Loading...</p>;
    if (!prompt) return <p>No prompt found!</p>;

    return (
        <>
            <EditComponent prompt={prompt} setPrompt={setPrompt} />
        </>
    );
}

export default EditPrompts;
