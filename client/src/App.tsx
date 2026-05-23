import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import Store from "./pages/Store/Store"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/store/:id" element={<Store />} />
    </Routes>
  )
}

export default App
