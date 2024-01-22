import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Begin, Register, Login, Home} from './components'


function App() {


  return (
    <>

      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Begin />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Home" element={<Home />} />
          </Routes>
      </BrowserRouter>

    </>
  )
}

export default App

