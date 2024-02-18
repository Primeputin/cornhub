import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Begin, Register, Login, Home, Popular, About, Profile, 
  Post, CreatePost, EditPost, SinglePost, EditProfPic, AllPosts, AllComments } from './components';
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
              {/* for unregistered visitors */}
              <Route path="/Home/" element={<Home />} /> 
              {/* for registered visitors */}
              <Route path="/Home/:id" element={<Home />} />
              <Route path="/Popular" element={<Popular />} />
              <Route path="/About" element={<About />} />
              <Route path="/Profile/" element={<Profile />} />
              <Route path="/EditProfPic/" element={<EditProfPic />} />
              <Route path="/Post" element={<Post />} />
              <Route path="/CreatePost" element={<CreatePost />} />
              <Route path="/EditPost/:id" element={<EditPost />} />
              <Route path="/SinglePost/:id" element={<SinglePost />} />
              <Route path="/AllPosts/:id" element={<AllPosts />} />
              <Route path="/AllComments/:id" element={<AllComments />} />
            </Routes>
        </BrowserRouter>
      </AuthProvider>

    </>
  )
}

export default App

