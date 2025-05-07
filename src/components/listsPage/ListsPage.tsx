import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {GroceryList, GroceryItem} from '../../types/grocery';
import { formatDate } from '../../types/timeFormat';
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
    const [expandedListId, setExpandedListId] = useState<string | null>(null);
    const [expandedDeleteListId, setExpendedDeleteListId] = useState<string | null>(null);
    const [newListName, setNewListName] = useState('');
    const [inputPlaceholder, setInputPlaceholder] = useState("Insert new list name...");
    const newListInputRef = useRef<HTMLInputElement>(null);

    //handle input refernce when trying to add new list
    useEffect(() => {
        if(isInputingNewList) {
            newListInputRef.current?.focus();
        }
    }, [isInputingNewList]);

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

    //check if list complete
    const checkIfListComplete = (list: GroceryList) => {
        return list.items.length > 0 && list.items.every(item => item.checked);// first check if list isn't empty, then check if all items are checked(true)
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
                            {expandedListId !== list.id ? (
                                <div className={styles.listLabelContainer}>
                                    <div className={`${styles.listCompletedToggle} ${checkIfListComplete(list) ? `${styles.activeToggle}` : ''}`}><FaCheck className={styles.checkIcon}/></div>
                                    <p className={styles.listNameLabel} onClick={() => setExpandedListId(prevId => prevId === list.id ? null : list.id)}>
                                       {list.name}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.listDropdownMenu}>
                                    <div className={styles.listDropdownMenuInfo} onClick={() => setExpandedListId(prevId => prevId === list.id ? null : list.id)}>
                                        <p>{list.name}</p>
                                        <p>
                                            <span>Status: </span>
                                            {list.items.length === 0
                                                ? ("list empty")
                                                : checkIfListComplete(list)
                                                    ? ("list complete")
                                                    : ("list incomplete")
                                            }
                                        </p>
                                        {checkIfListComplete(list) || list.items.length !== 0 && (
                                            <p>
                                                <span>Items: </span>
                                                {list.items.filter(item => item.checked).length} out of {list.items.length} checked
                                            </p>
                                        )}
                                        <p>
                                            <span>Created: </span>
                                            {formatDate(list.creationDate)}
                                        </p>
                                        {list.creationDate !== list.lastModified && (
                                            <p>
                                                <span>Modified: </span>
                                                {formatDate(list.lastModified)}
                                            </p>
                                        )}
                                    </div>
                                    <div className={styles.listDropdownMenuBtns}>
                                        {expandedDeleteListId !== list.id ? (
                                            <>
                                                <button className={styles.openListBtn} onClick={() => navigate(`/lists/${list.id}`, { state: {list}})}>Open</button>
                                                <button className={styles.deleteListBtn} onClick={() => setExpendedDeleteListId(prevId => prevId === list.id ? null : list.id)}>Delete</button>
                                            </>
                                        ) : (
                                            <>  
                                                <p className={styles.deletionText}>Delete list?</p>
                                                <button className={styles.confirmDeletionBtn} onClick={() => deleteList(list.id)}>Yes</button>
                                                <button className={styles.cancelDeletionBtn} onClick={() => setExpendedDeleteListId(null)}>No</button>
                                            </>
                                        )}
                                    </div> 
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className={styles.addNewListContainer}>
                    {isInputingNewList ? (
                        <div className={styles.addNewListInputContainer}>
                            <input 
                                ref={newListInputRef}
                                type="text"
                                value={newListName}
                                placeholder={inputPlaceholder}
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