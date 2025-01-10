import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../features/pokemonSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PokemonCard from "../components/PokemonCard";
import Button from "../components/Button";
import "./MyPokemon.css";

const MyPokemon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.mypokemon);

  useEffect(() => {
    dispatch(fetchItems("/mypokemons"));
  }, [dispatch]);

  console.log("Pokemon items:", items);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this pokemon from your pokemon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // dispatch(deleteItem({ endpoint: "/mypokemons", id }))
        //   .unwrap()
        //   .then(() => {
        //     Swal.fire("Deleted!", "Your pokemon has been deleted.", "success");
        //   })
        //   .catch((err) => {
        //     Swal.fire("Oops...", err.message || "Failed to delete pokemon", "error");
        //   });
      }
    });
  };

  const handleViewDetails = (pokemonId) => {
    navigate(`/mypokemons/${pokemonId}`);
  };

  return (
    <div className="pokemon-container">
      <h1>Your Pokemon</h1>
      <div className="pokemon-list">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => {
            const pokemon = item.pokemon || {};
            return (
              <PokemonCard
                key={item.id}
                pokemon={pokemon}
                onSelectPokemon={handleViewDetails}
                onRemovePokemon={handleDelete}
              />
            );
          })
        ) : (
          <p>No pokemon yet.</p>
        )}
      </div>
       
      <Button
        title="Add New Pokemon"
        onClick={() => navigate("/mypokemons/add")}
        className="add-pokemon-btn"
        bgColor="#646cff"
      />
    </div>
  );
};

export default MyPokemon;
