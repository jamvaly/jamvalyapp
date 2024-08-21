import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import OrderPage from "@/pages/order";
import FoodsPage from "@/pages/foods";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<OrderPage />} path="/order" />
      <Route element={<FoodsPage />} path="/foods" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
