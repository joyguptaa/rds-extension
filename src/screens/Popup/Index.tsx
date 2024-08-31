import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';

function Popup() {
  const [state] = useState('agdfdsafsd');
  return (
    <div>
      <h1>popup {state}</h1>
    </div>
  );
}
const rootElement = document.getElementById('popup');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Popup />);
} else {
  console.error('No element with id "popup" found');
}
