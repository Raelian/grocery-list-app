import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ListsPage from './components/listsPage/ListsPage';
import ItemsPage from './components/itemsPage/ItemsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ListsPage />} />
        <Route path='/lists/:id' element={<ItemsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
