import { useParams } from "react-router-dom";

function EditPrompts() {
    const promptId = useParams().id;

    return (
        <>
            <p>Hello world!</p>
            <p>{promptId}</p>
        </>
    );
}

export default EditPrompts;
