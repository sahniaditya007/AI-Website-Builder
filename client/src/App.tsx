import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Projects from './pages/Projects'
import MyProjects from './pages/MyProjects'
import Preview from './pages/Preview'
import Community from './pages/Community'
import View from './pages/View'
import AuthSignIn from './pages/AuthSignIn'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { Toaster } from "@/components/ui/sonner"
import AuthPage from './pages/auth/AuthPage'
import Settings from './pages/Settings'

const App = () => {
  return (
    <div>
      <NavBar />
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/projects/:projectId' element={<Projects />} />
        <Route path='/projects' element={<MyProjects />} />
        <Route path='/preview/:projectId' element={<Preview />} />
        <Route path='/preview/:projectId/:versionId' element={<Preview />} />
        <Route path='/community' element={<Community />} />
        <Route path='/view/:projectId' element={<View />} />
        <Route path='/auth/signin' element={<AuthSignIn />} />
        <Route path='/auth/:pathname' element={<AuthPage />} />
        <Route path='/account/settings' element={<Settings />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App