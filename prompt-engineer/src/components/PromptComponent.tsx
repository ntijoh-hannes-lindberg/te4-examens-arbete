import { Link } from 'react-router-dom';

export function PromptComponent({ prompt }) {

  return (
    <>
        <Link to="/outputs">Go back</Link>
        <h1><strong>{prompt.title} </strong></h1>
        {prompt.text}
    </>
  )
}

export default PromptComponent
