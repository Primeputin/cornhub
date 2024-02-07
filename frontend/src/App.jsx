import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Begin, Register, Login, Home, Popular, About, Profile, Post, CreatePost, EditPost, SinglePost } from './components';

function App() {


  return (
    <>

      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Begin />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Popular" element={<Popular />} />
            <Route path="/About" element={<About />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Post" element={<Post />} />
            <Route path="/CreatePost" element={<CreatePost />} />
            <Route path="/EditPost/:id" element={<EditPost />} />
            <Route path="/SinglePost/:id" element={<SinglePost />} />
          </Routes>
      </BrowserRouter>

    </>
  )
}

export default App

