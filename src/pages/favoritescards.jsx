import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/favoritescards.css'

const FavoriteCards = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || []
      if (favoriteIds.length === 0) {
        setFavorites([])
        setLoading(false)
        return
      }

      try {
        const query = favoriteIds.map(id => `id:${id}`).join(' OR ')
        const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
          params: { q: query },
        })
        setFavorites(response.data.data)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err)
        setError('Erro ao carregar favoritos.')
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const removeFavorite = id => {
    const updatedFavorites = favorites.filter(card => card.id !== id)
    setFavorites(updatedFavorites)

    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    const updatedStoredFavorites = storedFavorites.filter(favId => favId !== id)
    localStorage.setItem('favorites', JSON.stringify(updatedStoredFavorites))
  }

  return (
    <div className="container">
      <h1>Minhas Capturas</h1>
      {loading && <p>Carregando favoritos...</p>}
      {error && <p>{error}</p>}
      {!loading && favorites.length === 0 && (
        <p>Você não tem nenhum pokemon capturado.</p>
      )}
      <div className="card">
        {favorites.map(card => (
          <div key={card.id} className="card-itens">
            <h3>{card.name}</h3>
            <div className="pokemon-image">
              <img src={card.images.small} alt={card.name} />
            </div>

            <div
              className="button-liberar"
              type="button"
              onClick={() => removeFavorite(card.id)}
            >
              Liberar
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoriteCards
