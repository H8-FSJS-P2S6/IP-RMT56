import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeCard from "../components/HomeCard";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { fetchItems } from "../features/entitySlice";

export default function Home() {
  const dispatch = useDispatch();
  const { items: pokemons, pagination } = useSelector((state) => state.entity);

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(pagination.page);
  const [totalPages, setTotalPages] = useState(pagination.totalPages);
  const [limit] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching items...");
    dispatch(fetchItems(`/pub?page=${currentPage}&limit=${limit}`));
  }, [dispatch, currentPage, limit]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      navigate(`/pub?page=${page}&limit=${limit}`);
    }
  };

  if (!pokemons || !Array.isArray(pokemons)) {
    return <div>Loading...</div>;
  }

  console.log("Pokemons:", pokemons); // Line 35
  const currentPagePokemons = pokemons.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );
  console.log("Current Page Pokemons:", currentPagePokemons); // Line 40

  return (
    <div className="home-page">
      <h1>PokemonDeck</h1>

      <div className="pokemon-grid">
        {currentPagePokemons.map((pokemon) => (
          <HomeCard
            key={pokemon.id}
            pokemon={pokemon}
            onSelectPokemon={(pokemon) => setSelectedPokemon(pokemon)}
            isDetail={false}
          />
        ))}
      </div>

      {selectedPokemon && (
        <div className="pokemon-details-overlay">
          <div className="pokemon-details-modal">
            <h2>Pokemon Details</h2>
            <HomeCard pokemon={selectedPokemon} isDetail={true} />
            <button
              className="close-button"
              onClick={() => setSelectedPokemon(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}