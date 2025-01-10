import React from "react";
import "./PokemonCard.css";
import Button from "./Button";

export default function PokemonCard({
  pokemon,
  onRemovePokemon,
  onSelectPokemon,
}) {
  return (
    <div className="favorite-card">
      <div className="image-container">
        <img
          src={pokemon.image || "default-image.jpg"}
          alt={pokemon.name}
          className="pokemon-image"
        />
      </div>
      <h3>{pokemon.name}</h3>
      <p>Url: {pokemon.url}</p>
      <p>ID: {pokemon.id}</p>
      <div className="button-container">
        <Button
          title="View Details"
          onClick={() => onSelectPokemon(pokemon.id)}
          className="details-button"
          bgColor="#535bf2"
        />
        <Button
          title="Remove Pokemon"
          onClick={() => onRemovePokemon(pokemon.id)}
          className="remove-button"
          bgColor="#f44336"
        />
      </div>
    </div>
  );
}
