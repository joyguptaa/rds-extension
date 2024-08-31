import { createRoot } from 'react-dom/client';
import React from 'react';
import { getCookie } from '@/utils/helper';
console.log(getCookie);
export default function Options() {
  return (
    <div>
      <h1>Options</h1>
    </div>
  );
}
const rootElement = document?.getElementById('options');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Options />);
}
