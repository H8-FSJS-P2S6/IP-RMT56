const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { 
    register,
    login,
    googleLogin,
 } = require("../controllers/userController");
const { 
    getAllPokemons,
    getPokemons,
 } = require("../controllers/pokemonController");
const {
    createMyPokemon,
    getMyPokemons, 
    getMyPokemonById, 
    updateMyPokemon, 
    deleteMyPokemon 
} = require("../controllers/myListsController");
const { askAI } = require("../controllers/geminiAIController");
const { getTest } = require("../controllers/testController");

router.get("/pub", getPokemons);
router.post("/gemini-ask", askAI);
router.get("/test", getTest);

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);

router.get("/pokemons", getAllPokemons);
router.use(authentication);
router.post("/mypokemons", createMyPokemon);
router.get("/mypokemons", getMyPokemons);
router.get("/mypokemons/:id", getMyPokemonById);
router.put("/mypokemons/:id", updateMyPokemon);
router.delete("/mypokemons/:id", deleteMyPokemon);

module.exports = router;