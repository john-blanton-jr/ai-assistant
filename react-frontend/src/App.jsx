import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bot from './assistant/bot';

function App() {
  return (
    <BrowserRouter>
      {/* <Nav /> */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Bot />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

