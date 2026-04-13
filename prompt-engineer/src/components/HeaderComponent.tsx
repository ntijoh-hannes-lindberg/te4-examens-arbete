import { Link } from 'react-router-dom';

function HeaderComponent() {
  return (
    <header>
      <ul>
        <li><Link to="/">Home</Link></li>
      </ul>
    </header>
  )
}

export default HeaderComponent