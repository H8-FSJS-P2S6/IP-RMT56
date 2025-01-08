import "./HomeCard.css";

export default function HomeCard({ pokemon, onSelectPokemon, isDetail }) {
  return (
    <div className="home-card">
      <div className="image-container">
        <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
      </div>
      <h3>{pokemon.name}</h3>
      {isDetail && (
        <>
          <p>Url: {pokemon.image}</p>
          <p>ID: {pokemon.id}</p>
        </>
      )}
      {!isDetail && (
        <button
          onClick={() => onSelectPokemon(pokemon)}
          className="details-button"
        >
          View Details
        </button>
      )}
    </div>
  );
}
