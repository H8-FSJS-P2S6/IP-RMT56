import React from "react";
import "./HomeCard.css";

export default function HomeCard1({ pokemon, onSelectPokemon, isDetail }) {
  return (
    <div className="home-card" onClick={() => onSelectPokemon(pokemon)}>
      <img src={pokemon.image} alt={pokemon.name} />
      <h3>{pokemon.name}</h3>
      {!isDetail && <button>View Details</button>}
    </div>
  );
}
