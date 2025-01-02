import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">Explore Our Pokedeck</h1>
      <p className="about-description">
        WDiscover detailed information about thousands of Pokémon cards to add to your collections.
        From base sets to modern expansions, our vast Pokédex is exactly what your need for those quick and easy lookups.
      </p>

      <h2 className="about-subtitle">Create Collections</h2>
      <p className="about-description">
        Build, track, and organize your Pokémon card collections, your way, with ease.
        Every card from the common Lechonks to the rarest Charizards. Track your collection progress and wishlists today.
      </p>

      <h2 className="about-subtitle">Share & Connect</h2>
      <p className="about-description">
      Show off your collections, get feedback on your new decks, and connect with fellow trainers.
      </p>
    </div>
  );
}
