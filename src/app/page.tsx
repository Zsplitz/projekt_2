'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

type Car = {
  id: number;
  model: string;
  year: number;
  engine: string;
  body: string;
};

export default function Page() {
  const [cars, setCars] = useState<Car[]>([]);
  const [newCar, setNewCar] = useState({
    model: '',
    year: '',
    engine: '',
    body: '',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    const res = await fetch('/api/bmw');
    const data = await res.json();
    setCars(data);
  }

  async function addCar() {
    // Lägg till den nya bilen på servern
    await fetch('/api/bmw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: newCar.model,
        year: Number(newCar.year),
        engine: newCar.engine,
        body: newCar.body,
      }),
    });

    // Direkt uppdatera lokal state för att lägga till bilen utan att vänta på servern
    const addedCar = {
      id: Date.now(), // Använd ett temporärt ID (du kan justera detta om servern genererar det)
      model: newCar.model,
      year: Number(newCar.year),
      engine: newCar.engine,
      body: newCar.body,
    };

    setCars([...cars, addedCar]);

    // Nollställ input-fälten
    setNewCar({ model: '', year: '', engine: '', body: '' });
  }

  async function deleteCar(id: number) {
    console.log("Försöker ta bort bil med id:", id); // debug
    const res = await fetch('/api/bmw', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setCars(cars.filter(car => car.id !== id));
    } else {
      console.error("Borttagning misslyckades");
    }
  }

  const hasInput = newCar.model || newCar.year || newCar.engine || newCar.body;

  return (
    <div className="w-full h-screen flex">
      <Sidebar />
      <div className="p-4 w-full">
        <Content />

        <div className="mb-4">
          <input
            type="text"
            placeholder="Model"
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Year"
            value={newCar.year}
            onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Engine"
            value={newCar.engine}
            onChange={(e) => setNewCar({ ...newCar, engine: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Bodystyle"
            value={newCar.body}
            onChange={(e) => setNewCar({ ...newCar, body: e.target.value })}
            className="border p-2 mr-2"
          />
          <button onClick={addCar} className="bg-blue-500 text-white p-2">
            Lägg till bil
          </button>
        </div>

        {/* Lista av sparade bilar + live preview */}
        <ul className="space-y-4">
          {[...cars, ...(hasInput ? [{
            id: -1,
            model: newCar.model,
            year: Number(newCar.year),
            engine: newCar.engine,
            body: newCar.body
          }] : [])].map((car) => (
            <li
              key={car.id}
              className={`flex justify-between items-start border p-4 rounded shadow-sm ${car.id === -1 ? 'bg-yellow-50' : ''}`}
            >
              <div>
                <p><strong>Model:</strong> {car.model}</p>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Engine:</strong> {car.engine}</p>
                <p><strong>Bodystyle:</strong> {car.body}</p>
              </div>
              {car.id !== -1 && (
                <button
                  onClick={() => deleteCar(car.id)}
                  className="text-red-500 ml-4"
                >
                  Ta bort
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
