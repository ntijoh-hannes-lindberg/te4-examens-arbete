export async function newPrompt(prompt : string, type : string, title : string, properties : number[]): Promise<string> {
    try {
        const response = await fetch(
            `http://localhost:8080/prompts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: prompt,
                type: type,
                title: title,
                property_ids: properties
            })
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        return null
    } catch (e) {
        return new Error("Posting new prompt: " + e.message).message
    }
}

export async function allPrompts() {
    try {
        const response = await fetch(
            `http://localhost:8080/prompts`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        const jsonResponse = await response.json()
        return jsonResponse 
    } catch (e) {
        console.error("Fetching all prompts: ", e);
        throw e
    }
}

export async function getPrompt(id: string) {
    try {
        const response = await fetch(
            `http://localhost:8080/prompts/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }

        const jsonResponse = await response.json()
        return jsonResponse 
    } catch (e) {
        console.error("Getting prompt: ", e);
        throw e
    }
}

export async function updatePrompt(id: number, title: string, text: string, type: string) {
    try {
        const response = await fetch(
            `http://localhost:8080/prompts/${id}/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                text: text,
                type: type
            })
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }

        return null
    } catch (e) {
        console.error("updating prompt: ", e);
        return e.message
    }
}

export async function deletePrompt(id: string) {
    try {
        const response = await fetch(
            `http://localhost:8080/prompts/delete/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        return null
    } catch (e) {
        console.error("Deleting prompt: ", e);
        return e.message
    }
}

// Output methods

export async function allOutputs() {
    try {
        const response = await fetch(
            `http://localhost:8080/outputs`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        const jsonResponse = await response.json()
        return jsonResponse 
    } catch (e) {
        console.error("Posting new prompt: ", e);
        throw e
    }
}

export async function deleteOutput(id: string) {
    try {
        const response = await fetch(
            `http://localhost:8080/outputs/delete/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        return null
    } catch (e) {
        console.error("Deleting output: ", e);
        return e.message
    }
}

export async function newOutput(systemPrompt: string, userPrompt: string) {
    try {
        const response = await fetch(
            `http://localhost:8080/outputs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                systemPrompt: systemPrompt,
                userPrompt: userPrompt
            })
        });

        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        return null
    } catch (e) {
        console.error("Posting new output: ", e);
        return e.message
    }
}

export function allProperties() {
    try {
        return fetch(
            `http://localhost:8080/properties`, {
            method: "GET",
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response.status + " " + response.statusText);
            }
            return response.json();
        });
    } catch (e) {
        console.error("Fetching all properties: ", e);
        throw e
    }
}

export async function getPropertiesForPrompt(id: number) {
    const response = await fetch(`http://localhost:8080/prompts/${id}/properties`);
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.json();
}


export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

