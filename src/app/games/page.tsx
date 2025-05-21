'use client';

import React, { useState, useEffect } from 'react';

interface Game {
    id: number;
    title: string;
    genre: string;
    publisher: string;
    thumbnail: string;
}

export default function Games() {
    const [selectedGenre, setSelectedGenre] = useState('');
    const [publisherQuery, setPublisherQuery] = useState('');
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchGames = async (genre: string | null) => {
        setLoading(true);
        try {
            const url = genre ? `/api/games?genre=${genre}` : `/api/games`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch games');
            const data = await res.json();
            setGames(data);
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames(selectedGenre || null);
    }, [selectedGenre]);

    const filteredGames = games.filter((game) =>
        game.publisher.toLowerCase().includes(publisherQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Games Explorer</h1>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label htmlFor="genre-select" className="block mb-2">
                        Filter by Genre:
                    </label>
                    <select
                        id="genre-select"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="p-2 border rounded w-full"
                        disabled={loading}
                    >
                        <option value="">All Genres</option>
                        <option value="RPG">RPG</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Strategy">Strategy</option>
                        <option value="Sports">Sports</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="publisher-search" className="block mb-2">
                        Search by Publisher:
                    </label>
                    <input
                        id="publisher-search"
                        type="text"
                        placeholder="Enter publisher name"
                        value={publisherQuery}
                        onChange={(e) => setPublisherQuery(e.target.value)}
                        className="p-2 border rounded w-full"
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading games...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.length > 0 ? (
                        filteredGames.map((game) => (
                            <div key={game.id} className="border rounded-lg p-4 shadow">
                                <img
                                    src={game.thumbnail}
                                    alt={game.title}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                                <h2 className="text-xl font-semibold">{game.title}</h2>
                                <p className="text-gray-600">Genre: {game.genre}</p>
                                <p className="text-gray-600">Publisher: {game.publisher}</p>
                            </div>
                        ))
                    ) : (
                        <p>No games match your filters</p>
                    )}
                </div>
            )}
        </div>
    );
}
