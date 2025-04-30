'use client';

import React from 'react';

export default function Content() {
    return (
        <div className="p-4 w-full">
            <h2 className="text-xl font-semibold mb-2">Välkommen till BMW-listan</h2>
            <p className="mb-4">
                Här kan du lägga till, visa och ta bort olika BMW-modeller. Ange modellnamn, årsmodell, motor och kroppsmodell för att skapa en ny post.
            </p>
            <p className="text-gray-600">
                Exempel: <strong>BMW 330i, 2020, B48 2.0L, g30</strong>
            </p>
        </div>
    );
}
