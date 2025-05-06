import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {GroceryList, GroceryItem} from '../../types/grocery';
import {loadLists, saveLists} from '../../utils/storage';
import {FaCheck} from 'react-icons/fa';
import styles from "./ListsPage.module.scss";

interface ListsPageProps {
    lists: GroceryList[];
    deleteList: (id: string) => void;
    addNewList: (input: string) => void;
}

function ListsPage({lists, deleteList, addNewList}: ListsPageProps ) {
    const navigate = useNavigate();
    const [isInputingNewList, setIfIsInputingNewList] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [inputPlaceholder, setInputPlaceholder] = useState("Insert new list name...");

    //toggle add new list btn appear or disappears
    const toggleInputingNewList = () => {
        setIfIsInputingNewList(prev => !prev);
    }
    //confirm making new list btn
    const confirmNewList = (input:string) => {
        if(input.length === 0) {
            setInputPlaceholder("List name required!");
        } else {
            addNewList(input);
            toggleInputingNewList();
            setInputPlaceholder("Insert new list name...");
        }
    }
    //cancel making new list btn
    const openNewListInput = () => {
        setNewListName('');
        setInputPlaceholder("Insert new list name...");
        toggleInputingNewList();
    }


    return (
        <div className={styles.pageContainer}>
            <header className={styles.listPageHeader}>
                <h1>Lists</h1>
                <button className={styles.languageToggleBtn}></button>
            </header>
            <main className={styles.listPageMain}>
                <ul>
                    {lists.map((list) => (
                        <li key={list.id}>
                            <div className={`${styles.listCompletedToggle} ${list.completed === true ? `${styles.activeToggle}` : ''}`}><FaCheck className={styles.checkIcon}/></div>
                            <button className={styles.listBtn} onClick={() => navigate(`/lists/${list.id}`, { state: {list}})}>
                                {list.name}
                            </button>
                            <button className={styles.deleteListBtn} onClick={() => deleteList(list.id)}>X</button>
                        </li>
                    ))}
                </ul>
                <div className={styles.addNewListContainer}>
                    {isInputingNewList ? (
                        <div className={styles.addNewListInputContainer}>
                            <input 
                                type="text"
                                value={newListName}
                                placeholder= {inputPlaceholder}
                                maxLength={16}
                                onChange={(e) => setNewListName(e.target.value)}
                            />
                            <button className={styles.confirmNewList} onClick={() => confirmNewList(newListName)}><FaCheck className={styles.confirmIcon}/></button>
                            <button className={styles.cancelNewListProcess} onClick={() => toggleInputingNewList()}>X</button>
                        </div> 
                        ) : (
                        <button className={styles.addNewListBtn} onClick={() => openNewListInput()}>+</button>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ListsPage;