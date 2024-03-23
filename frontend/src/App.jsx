import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Begin, Register, Login, Home, Popular, About, Profile, 
  Post, CreatePost, EditPost, SinglePost, EditProfPic, AllPosts, AllComments, SearchResults } from './components';
import { AuthProvider } from './hocs/Auth';

function App() {


  return (
    <>
      <AuthProvider>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Begin />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Home/" element={<Home />} /> 
              <Route path="/Popular" element={<Popular />} />
              <Route path="/About" element={<About />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/EditProfPic" element={<EditProfPic />} />
              <Route path="/Post/:id" element={<Post />} />
              <Route path="/CreatePost" element={<CreatePost />} />
              <Route path="/EditPost/:id" element={<EditPost />} />
              <Route path="/SinglePost/:id" element={<SinglePost />} />
              <Route path="/AllPosts/:id" element={<AllPosts />} />
              <Route path="/AllComments/:id" element={<AllComments />} />
              <Route path="/Search/:SearchText" element={<SearchResults />} />
            </Routes>
        </BrowserRouter>
      </AuthProvider>

    </>
  )
}

export default App

