import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchItems } from "../features/pokemonSlice";
import Button from "../components/Button";
import "./MyPokemonById.css";

const MyPokemonById = () => {
  const { pokemonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.mypokemon);

  const [pokemonDetails, setPokemonDetails] = useState(null);

  useEffect(() => {
    dispatch(fetchItems("/mypokemons"));
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      const pokemon = items.find(
        (item) => item.pokemon.id === parseInt(pokemonId)
      );
      setPokemonDetails(pokemon);
    }
  }, [items, pokemonId]);

  if (!pokemonDetails) {
    return <p>Pokemon not found!</p>;
  }

  const { pokemon } = pokemonDetails;

  return (
    <div className="pokemon-detail-container">
      <h1>{pokemon.name}</h1>
      <img
        src={pokemon.img || "default-image.jpg"}
        alt={pokemon.name}
        style={{ width: "300px", height: "300px" }}
      />
      <div>
        <p>
          <strong>ID:</strong> {pokemon.id}
        </p>
        <p>
          <strong>Name:</strong> {pokemon.name}
        </p>
        <p>
          <strong>Url:</strong>
          {pokemon.url}
        </p>
      </div>
      <Button
        title="Back to Pokemon List"
        onClick={() => navigate("/mypokemons")}
        className="back-button"
        bgColor="#646cff"
      />
    </div>
  );
};

export default MyPokemonById;
