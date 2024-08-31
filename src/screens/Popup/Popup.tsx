import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';

export default function Popup() {
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
}
