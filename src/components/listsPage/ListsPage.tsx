import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {GroceryList, GroceryItem} from '../../types/grocery';
import {loadLists, saveLists} from '../../utils/storage';
import {FaCheck} from 'react-icons/fa';
import "./ListsPage.scss";

function ListsPage() {
    const navigate = useNavigate();
    const [isInputingNewList, setIfIsInputingNewList] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [inputPlaceholder, setInputPlaceholder] = useState("Insert new list name...");
    const [lists, setLists] = useState<GroceryList[]>([
        {id: '1', name: 'Grocery 1', completed: false, items: [] },
        {id: '2', name: 'Grocery 2', completed: true, items: [] },
        {id: '3', name: 'Grocery 3', completed: false, items: [] },
    ]);

    useEffect(() => {
        const fetchLists = async () => {
            const loadedLists = await loadLists();
            if(loadedLists.length > 0) {
                setLists(loadedLists);
            }
        };

        fetchLists();
    }, []); //empty dependency array means this runs once when the component is first rendered

    //delete list by id
    const deleteList = async (id: string) => {
        const updatedLists = lists.filter(list => list.id !== id); //remove list with that id
        setLists(updatedLists); //update the state
        await saveLists(updatedLists);
    }

    //add new list
    const addNewList = async (input:string) => {
        const newList: GroceryList = {
            id: Date.now().toString(),
            name: input,
            completed: false,
            items: [],
        };
        const updatedLists = [...lists, newList];
        setLists(updatedLists); //update the state with the new list
        await saveLists(updatedLists); //save the new list to localforage
    }

    const toggleInputingNewList = () => {
        setIfIsInputingNewList(prev => !prev);
    }

    const confirmNewList = (input:string) => {
        if(input.length == 0) {
            setInputPlaceholder("List name required!");
        } else {
            addNewList(input);
            toggleInputingNewList();
            setInputPlaceholder("Insert new list name...");
        }
    }

    const cancelNewList = () => {
        setNewListName('');
        toggleInputingNewList();
        setInputPlaceholder("Insert new list name...");
    }

    return (
        <div className="page-container">
            <header className="list-page-header">
                <h1>Lists</h1>
                <button className="language-toggle-btn"></button>
            </header>
            <main className="list-page-main">
                <ul>
                    {lists.map((list) => (
                        <li key={list.id}>
                            <div className={`list-completed-toggle ${list.completed === true ? 'active-toggle' : ''}`}><FaCheck className='check-icon'/></div>
                            <button className='list-btn' onClick={() => navigate(`/lists/${list.id}`)}>
                                {list.name}
                            </button>
                            <button className='delete-list-btn' onClick={() => deleteList(list.id)}>X</button>
                        </li>
                    ))}
                </ul>
                <div className='add-new-list-container'>
                    {isInputingNewList ? (
                        <div className='add-new-list-input-container'>
                            <input 
                                type="text"
                                value={newListName}
                                placeholder= {inputPlaceholder}
                                onChange={(e) => setNewListName(e.target.value)}
                            />
                            <button className='confirm-new-list' onClick={() => confirmNewList(newListName)}><FaCheck className='confirm-icon'/></button>
                            <button className='cancel-new-list-process' onClick={() => toggleInputingNewList()}>X</button>
                        </div> 
                        ) : (
                        <button className='add-new-list-btn' onClick={() => cancelNewList()}>+</button>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ListsPage;