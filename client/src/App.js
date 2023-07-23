import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home } from './Pages/home';
import { Auth } from './Pages/auth';
import { SavedBooks } from './Pages/saved-books';
import { Navbar } from './components/navbar';
import { Signin } from './Pages/login';

function App() {
  return (
    <div className="App">
      <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/auth' element={<Auth/>}/>
          <Route path='/reading-books' element={<SavedBooks/>}/>
          <Route path='/signin' element={<Signin/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
