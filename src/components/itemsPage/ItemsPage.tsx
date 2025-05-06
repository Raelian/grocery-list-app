import { useState } from "react";
import { GroceryItem, GroceryList } from "../../types/grocery";
import { useLocation, useNavigate } from "react-router-dom";
import {FaCheck, FaArrowLeft} from 'react-icons/fa';
import styles from './Items.Page.module.scss';

interface ItemsPageProps {
    updateMainLists: (newOriginalList: GroceryList) => Promise<void>;
}

function ItemsPage({updateMainLists}: ItemsPageProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const list = location.state.list as GroceryList;
    const [updatedList, setUpdatedList] = useState<GroceryList>(list);
    const [isInputingNewItem, setIfIsInputingNewItem] = useState<boolean>(false);
    const [inputQuantityValue, setInputQuantityValue] = useState<string>("");
    const [inputItemName, setInputItemName] = useState<string>("");
    const [nameInputPlaceholder, setNameInputPlaceholder] = useState<string>("Add item name...");

    //check if list complete
    const checkIfListComplete = (list: GroceryList) => {
        return list.items.length > 0 && !list.items.some(item => !item.checked);// first check if list isn't empty, then check if any items unchecked(false)
    }

    //toggle between complete and incomplete list
    const toggleListCompletion = async (list: GroceryList) => {
        const listCompleted = checkIfListComplete(list);

        if(listCompleted) {
            const completedList = {...list, completed: listCompleted};
            setUpdatedList(completedList);
            await updateMainLists(completedList);
        } else if (!listCompleted) {
            const incompleteList = {...list, completed: listCompleted};
            setUpdatedList(incompleteList);
            await updateMainLists(incompleteList);
        } else console.log("Error occured, should have been true or false!");
    }

    //checks or unchecks item on list
    const toggleItemChecked = (id: string) => {
        const modifiedItems = updatedList.items.map((item) =>
            item.id === id
                ? {...item, checked: !item.checked}
                : item
        );
        const newList = {...updatedList, items: modifiedItems};
        toggleListCompletion(newList);
    }

    //delete item
    const deleteItem = (id: string) => {
        const modifiedItems = updatedList.items.filter((item) => item.id !== id);
        const newList = {...updatedList, items: modifiedItems};
        toggleListCompletion(newList);
    }

    //add or substract quantiry
    const quantityOperation = async (id: string, quantity: number, operation: string) => {
        let operator: number = 0;
        switch (operation) {
            case "add":
                operator = 1;
                break;
            case "substract":
                operator = -1;
                break;
            default:
                console.log("No operator match!");
        }

        if(quantity === 999 && operator === 1) return;
        if(quantity === 1 && operator === -1) return;

        const modifiedItems = updatedList.items.map((item) =>
            item.id === id
                ? {...item, quantity: item.quantity + operator}
                : item
        )

        const newList = {...updatedList, items: modifiedItems};
        setUpdatedList(newList);
        await updateMainLists(newList);
    }

    //toggles between input menu and button
    const toggleInputingNewItem = () => {
        setIfIsInputingNewItem((prev) => prev = !prev);
    }

    //confirms new item, checks if item name was added and turns value of "" into 1
    const confirmNewItem = async (name: string, quantity: string) => {
        if(name.length === 0) {
            setNameInputPlaceholder("Item name required!")
            return;
        }
        if(quantity === "") quantity = "1";

        const newItem: GroceryItem = {
            id: Date.now().toString(),
            name: name,
            quantity: Number(quantity),
            checked: false,
        }

        const modifiedItems = [...updatedList.items, newItem];
        const newList = {...updatedList, items: modifiedItems};
        toggleListCompletion(newList);
        resetInput();
    }

    //open new item input menu
    const openNewItemInput = () => {
        resetInput();
        toggleInputingNewItem();
    }

    //resets input values on pressing confirm button
    const resetInput = () => {
        setInputItemName("");
        setInputQuantityValue("");
        setNameInputPlaceholder("Add item name...")
    }

    //handles item quantity values on change so the value doesn't go over 999 and if below 0 it adds "" for better user experience, "" will be changes to 1 later
    const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>, setInputQuantityValue: React.Dispatch<React.SetStateAction<string>>) => {
        const userInput = e.target.value;
        const convertedUserInput = Number(userInput);

        if(userInput === "" || convertedUserInput <= 0) {
            setInputQuantityValue("");
            return;
        } else if (convertedUserInput > 999) {
            setInputQuantityValue("999")
            return;
        }

        setInputQuantityValue(userInput);
    }

    return (
        <div className={styles.pageContainer}>
            <header className={styles.itemsPageHeader}>
                <button className={styles.itemsPageBackBtn} onClick={() => navigate('/')}><FaArrowLeft className={styles.itemsPageBackIcon}/></button>
                <h1>{updatedList.name}</h1>
            </header>
            <main className={styles.itemsPageMain}>
                <ul>
                    {updatedList.items.map((item) => (
                        <li key={item.id}>
                            <div className={`${styles.itemCompletedToggle} ${item.checked === true ? `${styles.activeToggle}` : ''}`}><FaCheck className={styles.checkIcon}/></div>
                            <button className={styles.itemBtn} onClick={() => toggleItemChecked(item.id)}>{item.name}</button>
                            <p className={styles.itemQuantity}>{item.quantity <= 1 ? "" : "x " + item.quantity}</p>
                            <button className={styles.addOneItemBtn} onClick={() => quantityOperation(item.id, item.quantity, "add")}>+</button>
                            <button className={styles.substractOneItemBtn} onClick={() => quantityOperation(item.id, item.quantity, "substract")}>-</button>
                            <button className={styles.deleteItemBtn} onClick={() => deleteItem(item.id)}>X</button>
                        </li>
                    ))}
                </ul>
                <div className={styles.addNewItemContainer}>
                    {isInputingNewItem ? (
                        <div className={styles.addNewItemInputContainer}>
                            <input 
                                type="text" 
                                maxLength={11}
                                value={inputItemName}
                                className={styles.itemNameInput} 
                                placeholder={nameInputPlaceholder}
                                onChange={(e) => setInputItemName(e.target.value)}
                            />
                            <input 
                                type="number" 
                                min="1" 
                                max="999" 
                                value={inputQuantityValue} 
                                className={styles.itemQuantityInput} 
                                placeholder="1"
                                onChange={(e) => handleQuantityInput(e, setInputQuantityValue)}
                            />
                            <button className={styles.confirmNewItem} onClick={() => confirmNewItem(inputItemName, inputQuantityValue)}><FaCheck className={styles.confirmIcon}/></button>
                            <button className={styles.cancelNewItemProcess} onClick={() => toggleInputingNewItem()}>X</button>
                        </div>
                    ) : (
                        <button className={styles.addNewItemBtn} onClick={() => openNewItemInput()}>+</button>
                    )}
                </div>
            </main>
        </div>
    )
}

export default ItemsPage;