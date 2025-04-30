// app/api/todos/route.ts
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database("./sqlite.db")

export async function GET() {
    const cars = db.prepare("SELECT * FROM bmw").all()
    return NextResponse.json(cars);
}

export async function POST(req: Request) {
    const car = await req.json();
    const newCar = { id: Date.now(), ...car };
    const stmt = db.prepare(`
        INSERT INTO bmw (model, year, engine, body)
        VALUES (@model, @year, @engine, @body)
      `);

    stmt.run(newCar);

    return NextResponse.json(newCar, { status: 201 });
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    const stmt = db.prepare("DELETE FROM bmw WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
        return NextResponse.json({ success: false, message: "Bil hittades inte" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}

