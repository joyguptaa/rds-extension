import { createRoot } from 'react-dom/client';
import React from 'react';
export default function Popup() {
  return (
    <div>
      <h1>Popup</h1>
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
