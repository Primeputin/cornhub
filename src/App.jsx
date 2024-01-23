import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Begin, Register, Login, Home, About, Profile, Post } from './components'


function App() {


  return (
    <>

      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Begin />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Post" element={<Post />} />
          </Routes>
      </BrowserRouter>

    </>
  )
}

export default App

