import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Images from './pages/Images'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import CreateImages from './pages/CreateImages'
import ProtectedRoute from './utils/ProtectedRoute'
import Logout from './pages/Logout'
import {ViewImage, EditImage} from './pages/Image'
import CreateTags from './pages/CreateTags'
import TagInfo from './pages/TagInfo'
import './index.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/'
          element={
            <Home></Home>
          }
        />
        <Route 
          path='/images'
          element={
            <Images></Images>
          }
        />
        <Route 
          path='/images/:pk'
          element={
            <ViewImage></ViewImage>
          }
        />
        <Route
          path='/images/edit/:pk'
          element={
            <ProtectedRoute>
              <EditImage></EditImage>
            </ProtectedRoute>
          }
        />
        <Route
          path='/images/create'
          element={
            <ProtectedRoute>
              <CreateImages></CreateImages>
            </ProtectedRoute>
          }
        />
        <Route
          path='/tags/create'
          element={
            <ProtectedRoute>
              <CreateTags></CreateTags>
            </ProtectedRoute>
          }
        />
        <Route
          path='/tags'
          element={
            <TagInfo></TagInfo>
          }
        />
        <Route
          path='/login'
          element={
            <Auth method={'login'}></Auth>
          }
        />
        <Route
          path='/register'
          element={
            <Auth method={'register'}></Auth>
          }
        />
        <Route
          path='/logout'
          element={
            <Logout></Logout>
          }
        />
        <Route 
          path='/user/profile'
          element={
            <ProtectedRoute>
              <Profile isLogged={true}></Profile>
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/:username'
          element={
            <Profile></Profile>
          }
        />
        <Route
          path='*' //*
          element={
            <NotFound></NotFound>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
