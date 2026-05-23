import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProductDetail from "./pages/ProductDetail/ProductDetail"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/store/:id" element={<div>Store — coming soon</div>} />
    </Routes>
  )
}

export default App
