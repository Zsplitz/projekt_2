import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre'); // May be null

    try {
        const db = await open({
            filename: './games.db',
            driver: sqlite3.Database
        });

        let games;

        if (genre) {
            games = await db.all(
                'SELECT * FROM games WHERE genre = ?',
                genre
            );
        } else {
            games = await db.all(
                'SELECT * FROM games'
            );
        }

        await db.close();
        return NextResponse.json(games);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch games' },
            { status: 500 }
        );
    }
}
