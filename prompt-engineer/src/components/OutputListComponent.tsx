import { useEffect, useState } from "react";
import { allOutputs, deleteOutput, } from "../services/apiService";
import { type Output } from "../../types/output";

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
                    <p>
                        {output.text}
                    </p>
                    <button onClick={() => handleDelete(output.id)}>Delete</button>
                </div>
            ))}
        </>
    );
}

export default OutputListComponent;