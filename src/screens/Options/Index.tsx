import { createRoot } from 'react-dom/client';
import React from 'react';
export default function Options() {
  return (
    <div>
      <h1>Options</h1>
    </div>
  );
}
const rootElement = document.getElementById('options');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Options />);
} else {
  console.error('No element with id "options" found');
}
