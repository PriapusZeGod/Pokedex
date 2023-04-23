import React, { useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  useParams,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/:pokemonId",
      element: <About />,
    },
  ]);

  return <RouterProvider router={router} />;
}

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [previousUrl, setPreviousUrl] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=18"
        );
        const data = await response.json();
        setPokemonList(data.results);
        setPreviousUrl(data.previous);
        setNextUrl(data.next);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handlePreviousClick = async () => {
    try {
      const response = await fetch(previousUrl);
      const data = await response.json();
      setPokemonList(data.results);
      setPreviousUrl(data.previous);
      setNextUrl(data.next);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextClick = async () => {
    try {
      const response = await fetch(nextUrl);
      const data = await response.json();
      setPokemonList(data.results);
      setPreviousUrl(data.previous);
      setNextUrl(data.next);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="app-container">
      <h1>Pokedex</h1>
      <div className="cards-container">
        {pokemonList.map((pokemon, index) => (
          <Card
            key={index}
            pokemonName={pokemon.name}
            pokemonUrl={pokemon.url}
          />
        ))}
      </div>
      <div className="pagination-container">
        {previousUrl && <button onClick={handlePreviousClick}>Previous</button>}
        {nextUrl && <button onClick={handleNextClick}>Next</button>}
      </div>
    </div>
  );
}

function Card({ pokemonName, pokemonUrl }) {
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonType, setPokemonType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(pokemonUrl);
        const data = await response.json();
        setPokemonData(data);
        setPokemonType(data.types[0].type.name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [pokemonUrl]);

  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  const cardStyle = {
    backgroundColor: typeColors[pokemonType],
  };

  return (
    pokemonData && (
      <a href={"/" + pokemonData.id} className="card" style={cardStyle}>
        {pokemonData ? (
          <>
            <div className="card-devider">
              <p>#{pokemonData.id}</p>
              <p>{pokemonName}</p>
            </div>
            <div className="card-devider">
              <img
                className="pokemon-image"
                src={pokemonData.sprites.front_default}
                alt={`${pokemonName} sprite`}
              />
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </a>
    )
  );
}

function About() {
  const { pokemonId } = useParams();
  const [pokemon, setPokemon] = useState({});
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    fetchPokemon(pokemonId);
  }, [pokemonId]);

  function fetchPokemon(id) {
    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
      .then((response) => {
        if (!response.ok) throw new Error("Response was not OK!");
        return response.json();
      })
      .then((data) => {
        setPokemon(data);
        fetchAbilities(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchAbilities(pokemon) {
    if (pokemon === null) return;
    else {
      setAbilities([]);
      pokemon.abilities.forEach((e) => {
        fetch(e.ability.url)
          .then((response) => {
            if (!response.ok) throw new Error("Response was not OK!");
            return response.json();
          })
          .then((data) => {
            let effect = data.effect_entries.filter(
              (e) => e.language.name === "en"
            );
            const ability = {
              name: e.ability.name,
              effect: effect[0].effect,
              short_effect: effect[0].short_effect,
            };
            setAbilities((abilities) => [...abilities, ability]);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }

  return (
    pokemon.stats && (
      <div className="PokemonDetails">
        <header className="header">
          <img
            className="pokemon-img"
            src={pokemon.sprites.front_default}
            alt={"Pokemon Logo"}
          />
          <h1 className="pokemon-name">{pokemon.name}</h1>
        </header>

        <div className="container">
          <h2>Stats</h2>

          <table className="stats-table">
            <thead>
              <tr>
                <th>Stat</th>
                <th>Base Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HP</td>
                <td>{pokemon.stats[0].base_stat}</td>
              </tr>
              <tr>
                <td>Attack</td>
                <td>{pokemon.stats[1].base_stat}</td>
              </tr>
              <tr>
                <td>Defense</td>
                <td>{pokemon.stats[2].base_stat}</td>
              </tr>
              <tr>
                <td>Special Attack</td>
                <td>{pokemon.stats[3].base_stat}</td>
              </tr>
              <tr>
                <td>Special Defense</td>
                <td>{pokemon.stats[4].base_stat}</td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>{pokemon.stats[5].base_stat}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Abilities</h2>

        {abilities.map((e) => {
          return (
            <div className="ability-card">
              <h3>{e.name}</h3>
              <p>{e.effect}</p>
            </div>
          );
        })}

        <a className="btn" href="/">
          Back
        </a>
      </div>
    )
  );
}

export default App;
