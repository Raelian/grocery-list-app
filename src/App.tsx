import {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {GroceryList} from './types/grocery';
import {loadLists, saveLists} from './utils/storage';
import ListsPage from './components/listsPage/ListsPage';
import ItemsPage from './components/itemsPage/ItemsPage';
import ImportPage from './components/importPage/ImportPage';

function App() {
  const [lists, setLists] = useState<GroceryList[]>([])

  const fetchLists = async () => {
    const loadedLists = await loadLists();
    if(loadedLists.length > 0) {
      setLists(loadedLists);
    }
  };
  //fetch list on startup
  useEffect(() => {
    fetchLists();
  }, []);

  //delete list by id
  const deleteList = async (id: string) => {
    const updatedLists = lists.filter(list => list.id !== id); //remove list with that id
    setLists(updatedLists); //update the state
    await saveLists(updatedLists);
  }

  //add new list
  const addNewList = async (input: string | GroceryList) => {
      const newList: GroceryList = 
        typeof input === "string"
          ? {
              id: Date.now().toString(),
              name: input,
              items: [],
              creationDate: new Date().toISOString(),
              lastModified: new Date().toISOString(),
            }
          : input;
      
      const storedLists = await loadLists();
      const updatedLists = [...storedLists, newList];
      setLists(updatedLists); //update the state with the new list
      await saveLists(updatedLists); //save the new list to localforage
      await fetchLists();
  }

  //update list
  const updateMainLists = async (newList: GroceryList) => {
    const updatedLists = lists.map((list) => list.id === newList.id ? newList : list);
    setLists(updatedLists);
    await saveLists(updatedLists);
  }

  return (
    <BrowserRouter basename="/grocery-list-app">
      <Routes>
        <Route path='/' element={<ListsPage lists={lists} deleteList={deleteList} addNewList={addNewList}/>} />
        <Route path='/lists/:id' element={<ItemsPage updateMainLists={updateMainLists}/>} />
        <Route path='/import' element={<ImportPage addNewList={addNewList}/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
