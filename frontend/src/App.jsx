import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bike from "./pages/Bike/Bike";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Reservations from "./pages/Reservations/Reservations";

const RenderPage = () => {
  return (
    <div className="h-screen">
      <div className="h-[7%]">
        <Navbar />
      </div>
      <div className="h-[93%]">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="rounded-lg shadow-lg w-[30%]"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RenderPage />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Bike />} />
          <Route path="/reservations" element={<Reservations />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
