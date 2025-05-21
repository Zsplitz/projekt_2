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

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCar, setEditCar] = useState({
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
    setNewCar({ model: '', year: '', engine: '', body: '' });
    fetchCars();
  }

  async function deleteCar(id: number) {
    await fetch('/api/bmw', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchCars();
  }

  async function updateCar(id: number) {
    await fetch('/api/bmw', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        model: editCar.model,
        year: Number(editCar.year),
        engine: editCar.engine,
        body: editCar.body,
      }),
    });
    setEditingId(null);
    setEditCar({ model: '', year: '', engine: '', body: '' });
    fetchCars();
  }

  const hasInput =
    newCar.model || newCar.year || newCar.engine || newCar.body;

  const handleLoginRedirect = () => {
    window.location.href = '/github'; // Redirect to the login page
  };

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Login Button in the Top-Right Corner */}
      <button
        onClick={handleLoginRedirect}
        className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded"
      >
        Go to Login
      </button>

      <div className="flex flex-1">
        <Sidebar />
        <div className="p-4 w-full">
          <Content />

          <div className="mb-4">
            <input
              type="text"
              placeholder="Modell"
              value={newCar.model}
              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="År"
              value={newCar.year}
              onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Motor"
              value={newCar.engine}
              onChange={(e) => setNewCar({ ...newCar, engine: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Kroppsmodell"
              value={newCar.body}
              onChange={(e) => setNewCar({ ...newCar, body: e.target.value })}
              className="border p-2 mr-2"
            />
            <button onClick={addCar} className="bg-blue-500 text-white p-2">
              Lägg till bil
            </button>
          </div>

          <ul className="space-y-4">
            {[...cars, ...(hasInput ? [{
              id: -1,
              model: newCar.model,
              year: Number(newCar.year),
              engine: newCar.engine,
              body: newCar.body,
            }] : [])].map((car) => (
              <li
                key={car.id}
                className={`flex justify-between items-start border p-4 rounded shadow-sm ${car.id === -1 ? 'bg-black text-white' : ''}`}
              >
                {editingId === car.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editCar.model}
                      onChange={(e) => setEditCar({ ...editCar, model: e.target.value })}
                      className="border p-1"
                    />
                    <input
                      type="text"
                      value={editCar.year}
                      onChange={(e) => setEditCar({ ...editCar, year: e.target.value })}
                      className="border p-1"
                    />
                    <input
                      type="text"
                      value={editCar.engine}
                      onChange={(e) => setEditCar({ ...editCar, engine: e.target.value })}
                      className="border p-1"
                    />
                    <input
                      type="text"
                      value={editCar.body}
                      onChange={(e) => setEditCar({ ...editCar, body: e.target.value })}
                      className="border p-1"
                    />
                    <button
                      onClick={() => updateCar(car.id)}
                      className="bg-green-500 text-white px-2 py-1 mt-1"
                    >
                      Spara
                    </button>
                  </div>
                ) : (
                  <div>
                    <p><strong>Modell:</strong> {car.model}</p>
                    <p><strong>År:</strong> {car.year}</p>
                    <p><strong>Motor:</strong> {car.engine}</p>
                    <p><strong>Kroppsmodell:</strong> {car.body}</p>
                  </div>
                )}

                {car.id !== -1 && (
                  <div className="flex flex-col gap-2 ml-4">
                    {editingId !== car.id && (
                      <button
                        onClick={() => {
                          setEditingId(car.id);
                          setEditCar({
                            model: car.model,
                            year: String(car.year),
                            engine: car.engine,
                            body: car.body,
                          });
                        }}
                        className="text-blue-500"
                      >
                        Redigera
                      </button>
                    )}
                    <button
                      onClick={() => deleteCar(car.id)}
                      className="text-red-500"
                    >
                      Ta bort
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}