import React, { useEffect, useState } from "react";
import axios from "../config/axiosInstance";
import HomeCard from "../components/HomeCard";
import "./Home1.css";

export default function Home1() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [limit] = useState(9);

  const fetchPokemons = async (page = 0, name = "") => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `mypokemons/?page=${page}&limit=${limit}&name=${name}`
      );
      const { pokemons, totalPages } = response.data;

      setPokemons(pokemons);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(currentPage, searchName);
  }, [currentPage, searchName]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPokemons(0, searchName);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectPokemon = (pokemon) => {
    console.log("Selected Pokemon:", pokemon); // or handle any action here
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(pokemons) || pokemons.length === 0) {
    return <div>No data found</div>;
  }

  return (
    <div className="home-page">
      <h1>Pokemon</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <HomeCard
            key={pokemon.id}
            monster={pokemon}
            isDetail={false}
            onSelectMonster={handleSelectPokemon}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          disabled={currentPage + 1 === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
