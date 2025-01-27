import { useState, useEffect, useCallback } from 'react'
import { Pagination } from '@mui/material'
import axios from 'axios'
import BasicModal from '../components/Modal'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import '../styles/pokemoncards.css'

export const PokemonCards = () => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)
  const [types, setTypes] = useState([])
  const [rarities, setRarities] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('')
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favorites')) || []
  )

  const fetchFilters = useCallback(async () => {
    try {
      const [typesResponse, raritiesResponse] = await Promise.all([
        axios.get('https://api.pokemontcg.io/v2/types'),
        axios.get('https://api.pokemontcg.io/v2/rarities'),
      ])
      setTypes(typesResponse.data.data)
      setRarities(raritiesResponse.data.data)
    } catch (err) {
      console.error('Erro ao carregar filtros:', err)
    }
  }, []) 

  const fetchCards = useCallback(
    async (currentPage, searchTerm, type, rarity) => {
      setLoading(true)
      try {
        const query = []
        if (searchTerm) query.push(`name:${searchTerm}*`)
        if (type) query.push(`types:${type}`)
        if (rarity) query.push(`rarity:"${rarity}"`)

        const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
          params: {
            page: currentPage,
            pageSize: 20,
            q: query.length > 0 ? query.join(' ') : undefined,
          },
        })

        setCards(response.data.data)
        setTotalPages(Math.ceil(response.data.totalCount / 20))
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError('Erro ao carregar as cartas.')
        setLoading(false)
      }
    },
    []
  ) 

  useEffect(() => {
    fetchFilters()
  }, [fetchFilters]) 

  useEffect(() => {
    fetchCards(page, searchTerm, selectedType, selectedRarity)
  }, [fetchCards, page, searchTerm, selectedType, selectedRarity]) 

  const handleSearch = () => {
    setPage(1)
    setSearchTerm(search)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleSearchChange = event => {
    setSearch(event.target.value)
  }

  const handleTypeChange = event => {
    setSelectedType(event.target.value)
    setPage(1)
  }

  const handleRarityChange = event => {
    setSelectedRarity(event.target.value)
    setPage(1)
  }

  // Função para alternar favoritos
  const toggleFavorite = id => {
    let updatedFavorites
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id)
    } else {
      updatedFavorites = [...favorites, id]
    }
    setFavorites(updatedFavorites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  return (
    <div className="container">
      <div className="content">
        <h1>Lista de cartas do Pokémon TCG</h1>
        <p>Total de cartas na página: <strong>{cards.length}</strong> </p>
        

        <div className="search-filter">
          <div className="search">
            <input
              type="text"
              placeholder="Nome do Pokémon"
              value={search}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              onChange={handleSearchChange}
            />
            <button type="button" onClick={handleSearch}>
              <SearchOutlinedIcon />
            </button>
          </div>

          <button
            className='button-clean-filters'
            type="button"
            onClick={() => {
              setSearch('')
              setSearchTerm('')
              setSelectedType('')
              setSelectedRarity('')
              setPage(1)
            }}
          >
            Limpar Filtros
          </button>

          <div className='content-itens-select'>
            <div className='title-itens'>
            <FilterListOutlinedIcon />
            <span>Filtrar por:</span>
            </div>
            
            <div className="custom-select">
              <select value={selectedType} onChange={handleTypeChange}>
                <option value="">Tipos</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="custom-select">
              <select value={selectedRarity} onChange={handleRarityChange}>
                <option value="">Raridades</option>
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>
                    {rarity}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div>
        {cards.length === 0 && !loading && !error && (
          <p>Nenhum Pokémon encontrado com os filtros aplicados.</p>
        )}
        {error && <p>{error}</p>}

        <div>
          {loading && !cards.length ? (
            <p>Carregando cartas...</p>
          ) : (
            <div className="card">
              {cards.map(card => (
                <div className="card-itens" key={card.id}>
                  <div className="pokemon-image">
                    {card.images.small ? (
                      <img
                        onClick={() => setSelectedCard(card)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            setSelectedCard(card)
                          }
                        }}
                        src={card.images.small}
                        alt={card.name}
                      />
                    ) : (
                      <p>Imagem não disponível</p>
                    )}
                  </div>

                  <div className="content-details">
                    <div className="content-details-name-types">
                      <span>{card.name}</span>
                      <span>{card.types || 'N/A'}</span>
                    </div>
                    <div className="content-details-rarity-capture">
                      <span>{card.rarity || 'N/A'}</span>
                      <button
                        className={`button-favorite ${
                          favorites.includes(card.id)
                            ? 'button-favorite--active'
                            : 'button-favorite--inactive'
                        }`}
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          toggleFavorite(card.id)
                        }}
                      >
                        {favorites.includes(card.id) ? 'Liberar' : 'Capturar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Pagination
        className='pagination'
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
        style={{ marginTop: '20px',marginBottom: '20px', justifyContent: 'center', display: 'flex' }}
      />

      <BasicModal
        cardData={selectedCard}
        open={selectedCard !== null}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  )
}
