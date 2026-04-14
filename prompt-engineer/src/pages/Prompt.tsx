import TextFieldComponent from '../components/TextFieldComponent';

function Prompt({ prompt, setPrompt }) {
  return (
    <section>
      <h2>Prompt page</h2>
      <div className='page-content'>
        <TextFieldComponent prompt={prompt} setPrompt={setPrompt} />
      </div>
    </section>
  );
}

export default Prompt;