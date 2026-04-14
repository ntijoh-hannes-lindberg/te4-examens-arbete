import TextFieldComponent from '../components/TextFieldComponent';

function Prompt({ prompt, setPrompt }) {
  return (
    <>
      <h2>Prompt page</h2>
      <TextFieldComponent prompt={prompt} setPrompt={setPrompt} />
    </>
  );
}

export default Prompt;