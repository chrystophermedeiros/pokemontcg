import { Link } from 'react-router-dom'
import '../styles/header.css';

const Header = () => {
  return (
    <header className='header'>
      <img
        style={{ width: 100 }}
        src="https://images.pokemontcg.io/base1/symbol.png"
        alt="logo"
      />
      <div>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/capturados">Capturados</Link>
        </nav>
      </div>
      <a href="https://pokemontcg.io/" target="_blank" rel="noopener noreferrer">Sobre</a>
    </header>
  )
}

export default Header
