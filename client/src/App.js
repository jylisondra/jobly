import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// styles
import './App.css';

// pages
import Landing from './pages/landing/Landing';
import Error from './pages/error/Error';
import Register from './pages/register/Register';
import AddJob from './pages/dashboard//addJob/AddJob';
import AllJobs from './pages/dashboard/allJobs/AllJobs';
import AllInterviews from './pages/dashboard/allInterviews/AllInterviews';
import AddInterview from './pages/dashboard/addInterview/AddInterview';
import Profile from './pages/dashboard/profile/Profile';
import Stats from './pages/dashboard/stats/Stats';
import SharedLayout from './pages/dashboard/sharedLayout/SharedLayout';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Stats />} />
            <Route path="jobs" element={<AllJobs />} />
            <Route path="interviews" element={<AllInterviews />} />
            <Route path="interviews/create" element={<AddInterview />} />
            <Route path="jobs/create" element={<AddJob />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
