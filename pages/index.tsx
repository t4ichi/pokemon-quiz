import { useState, useEffect } from "react";
import { GetServerSideProps, NextPage } from "next";

const fetchPokemon = async () =>{
  const index = Math.floor(Math.random() * 1025 + 1);
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + index);
  const result = await res.json();
  return result;
};

interface IndexPageProps{
  id: number;
  name: string;
  front_image: string;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const IndexPage : NextPage<IndexPageProps> = (props: IndexPageProps) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [shuffledList, setShuffledList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    setShuffledList(shuffleArray([...pokemonList]));
  }, [pokemonList]);

  const handleClick = async () => {
    const tempList = [];
    for (let i = 0; i < 4; i++) {
      const pokemon = await fetchPokemon();
      tempList.push({
        id: pokemon['id'],
        name: pokemon['name'],
        imageUrl: pokemon['sprites']['front_default'],
        hp: pokemon['stats'][0]['base_stat'],
        attack: pokemon['stats'][1]['base_stat'],
        defense: pokemon['stats'][2]['base_stat'],
        specialAttack: pokemon['stats'][3]['base_stat'],
        specialDefense: pokemon['stats'][4]['base_stat'],
        speed: pokemon['stats'][5]['base_stat']
      });
    }
    setPokemonList(tempList);
    console.log(pokemonList);
  };

  const handleAnswer = () => {
    const selected = shuffledList[selectedPokemon];
    if (selected.id === pokemonList[0].id) {
      alert("正解！");
    } else {
      alert("不正解...");
    }
  };

  useEffect(() => {
    handleClick();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const pokemon = await fetchPokemon();
      setPokemonList([
        {
          id: pokemon['id'],
          name: pokemon['name'],
          imageUrl: pokemon['sprites']['front_default'],
          hp: pokemon['stats'][0]['base_stat'],
          attack: pokemon['stats'][1]['base_stat'],
          defense: pokemon['stats'][2]['base_stat'],
          specialAttack: pokemon['stats'][3]['base_stat'],
          specialDefense: pokemon['stats'][4]['base_stat'],
          speed: pokemon['stats'][5]['base_stat']
        }
      ]);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>種族値Quiz</h1>

      {pokemonList.slice(0, 1).map((pokemon, index) => (
        <div key={index}>
          <p>H: {pokemon.hp}</p>
          <p>A: {pokemon.attack}</p>
          <p>B: {pokemon.defense}</p>
          <p>C: {pokemon.specialAttack}</p>
          <p>D: {pokemon.specialDefense}</p>
          <p>S: {pokemon.speed}</p>
        </div>
      ))}
      {shuffledList.map((pokemon, index) => (
        <div key={index}>
          <br />
          <input type="radio" id={`pokemon-${index}`} name="selectedPokemon" value={index} onChange={(e) => setSelectedPokemon(e.target.value)} />
          <p>{pokemon.name}</p>
          <img src={pokemon.imageUrl}/>
        </div>
      ))}
      <button onClick={handleAnswer}>解答</button>
      
      <div>
        <button onClick={handleClick}>新しい問題</button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const pokemon = await fetchPokemon();
  return {
    props: {
      id: pokemon['id'],
      name: pokemon['name'],
      front_image: pokemon['sprites']['front_default'],
      hp: pokemon['stats'][0]['base_stat'],
      attack: pokemon['stats'][1]['base_stat'],
      defense: pokemon['stats'][2]['base_stat'],
      special_attack: pokemon['stats'][3]['base_stat'],
      special_defense: pokemon['stats'][4]['base_stat'],
      speed: pokemon['stats'][5]['base_stat'],
    },
  };
};

export default IndexPage;