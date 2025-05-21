import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('./sqlite.db');

export async function GET() {
    const cars = db.prepare('SELECT * FROM bmw').all();
    return NextResponse.json(cars);
}

export async function POST(req: Request) {
    const car = await req.json();
    const stmt = db.prepare(`
    INSERT INTO bmw (model, year, engine, body)
    VALUES (@model, @year, @engine, @body)
  `);
    stmt.run(car);
    return NextResponse.json(car, { status: 201 });
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    const stmt = db.prepare('DELETE FROM bmw WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
        return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}

// ✅ NY: PUT för att uppdatera bil
export async function PUT(req: Request) {
    const { id, model, year, engine, body } = await req.json();

    const stmt = db.prepare(`
    UPDATE bmw
    SET model = ?, year = ?, engine = ?, body = ?
    WHERE id = ?
  `);
    const result = stmt.run(model, year, engine, body, id);

    if (result.changes === 0) {
        return NextResponse.json({ success: false, message: 'Ingen bil hittades' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
