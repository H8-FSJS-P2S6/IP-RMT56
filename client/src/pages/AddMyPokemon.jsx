import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../config/axiosInstance";
import { addItem } from "../features/pokemonSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AddMyPokemon.css";

const AddMyPokemon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const { data } = await axios.get("/mypokemons", {
          params: { page: currentPage, limit: limit },
        });

        setPokemons(data.pokemons);
        setTotalPages(data.totalPages);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load pokemon",
        });
      }
    };

    fetchPokemons();
  }, [currentPage, limit]);

  const handleAddToPokemons = async (pokemonId) => {
    const selectedPokemon = pokemons.find(
      (pokemon) => pokemon.id === pokemonId
    );
    if (!selectedPokemon) return;

    try {
      const newItem = { pokemonId: selectedPokemon.id };
      await dispatch(addItem({ endpoint: "/mypokemons", newItem }));

      Swal.fire({
        icon: "success",
        title: `${selectedPokemon.name} has been added to your pokemons!`,
        showConfirmButton: false,
        timer: 1000,
      });

      navigate("/mypokemons");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add pokemon",
      });
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      navigate(`/mypokemons/add?page=${page}&limit=${limit}`);
    }
  };

  if (!pokemons || !Array.isArray(pokemons)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-pokemon-container">
      <h2>Add Pokemon to My Pokemon</h2>
      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <h3>{pokemon.name}</h3>
            <img
              src={pokemon.img}
              alt={pokemon.name}
              style={{ width: "100px", height: "100px" }}
            />
            <button onClick={() => handleAddToPokemons(pokemon.id)}>
              Add to My Pokemon
            </button>
          </div>
        ))}
      </div>

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
};

export default AddMyPokemon;
