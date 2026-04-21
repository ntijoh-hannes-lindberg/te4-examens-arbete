import PromptInputComponent from "../components/PromptInputComponent";
import PromptListComponent from "../components/PromptListComponent";

interface Props {
    prompt: string;
    setPrompt: (value: string) => void;
}

function Prompt({ prompt, setPrompt }: Props) {
  
    return (
        <>
            <PromptInputComponent prompt={prompt} setPrompt={setPrompt} />
            <PromptListComponent onSelect={setPrompt} />
        </>
    );
}

export default Prompt;
