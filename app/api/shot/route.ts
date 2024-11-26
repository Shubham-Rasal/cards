import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get a random Pokemon ID (there are currently 1008 Pokemon in the API)
    const randomPokemonId = Math.floor(Math.random() * 1008) + 1;
    
    // Fetch Pokemon data from PokeAPI
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);

    if (!response.ok) {
      throw new Error(`Pokemon API error: ${response.statusText}`);
    }

    const pokemonData = await response.json();

    // Extract relevant Pokemon information
    const pokemon = {
      name: pokemonData.name,
      id: pokemonData.id,
      image: pokemonData.sprites.other['official-artwork'].front_default,
      types: pokemonData.types.map((type: any) => type.type.name),
      stats: {
        hp: pokemonData.stats[0].base_stat,
        attack: pokemonData.stats[1].base_stat,
        defense: pokemonData.stats[2].base_stat,
        speed: pokemonData.stats[5].base_stat,
      }
    };

    return NextResponse.json(pokemon);

  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    );
  }
}
