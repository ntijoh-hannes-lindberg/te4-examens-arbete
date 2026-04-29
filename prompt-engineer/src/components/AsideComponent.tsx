import { Link } from 'react-router-dom';

function AsideComponent() {
  return (
    <aside>
      <ul>
        <li><Link to="/stats">Stats</Link></li>
        <li><Link to="/prompts">Prompts</Link></li>
        <li><Link to="/outputs">Outputs</Link></li>
      </ul>
    </aside>
  )
}

export default AsideComponent
