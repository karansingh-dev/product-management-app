import { Route, Routes } from "react-router-dom"
import ProductPage from "./components/pages/product"


function App() {
 

  return (
    <>
         <Routes>
            <Route path="/" element={<ProductPage />} />
           
         </Routes>
      </>

  )
}

export default App
