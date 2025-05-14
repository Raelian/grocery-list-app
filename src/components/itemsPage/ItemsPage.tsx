import {useState, useEffect, useRef} from "react";
import {GroceryItem, GroceryList, units, Unit} from "../../types/grocery";
import {useLocation, useNavigate} from "react-router-dom";
import {FaCheck, FaArrowLeft, FaPen} from 'react-icons/fa';
import styles from './Items.Page.module.scss';
import { cleanInput } from "../../utils/cleanInput";
import {useTranslation} from 'react-i18next';

interface ItemsPageProps {
    updateMainLists: (newOriginalList: GroceryList) => Promise<void>;
}

function ItemsPage({updateMainLists}: ItemsPageProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const list = location.state.list as GroceryList;
    const [updatedList, setUpdatedList] = useState<GroceryList>(list);
    const [isInputingNewItem, setIfIsInputingNewItem] = useState<boolean>(false);
    const [inputQuantityValue, setInputQuantityValue] = useState<string>("");
    const [inputItemName, setInputItemName] = useState<string>("");
    const [unitType, setUnitType] = useState<Unit>("");
    const newItemInputRef = useRef<HTMLInputElement>(null);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [itemAlertMessage, setItemAlertMessage] = useState<boolean>(false);

    //reference for add new item input menu
    let newItemInputMenuRef = useRef<HTMLDivElement | null>(null);

    //use effect for when clickling outside the referenced containers
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
           if(!newItemInputMenuRef.current?.contains(e.target as Node)){
                setIfIsInputingNewItem(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    //handle input refernce when trying to add new list
    useEffect(() => {
        if(isInputingNewItem) {
            newItemInputRef.current?.focus();
        }
    }, [isInputingNewItem]);

    //ipdate state and main lists
    const updateStateAndMainList = async (list: GroceryList) => {
        setUpdatedList(list);
        await updateMainLists(list);
    }

    //checks or unchecks item on list
    const toggleItemChecked = (id: string) => {
        const modifiedItems = updatedList.items.map((item) =>
            item.id === id
                ? {...item, checked: !item.checked}
                : item
        );
        const newList = {...updatedList, items: modifiedItems, lastModified: new Date().toISOString()};
        updateStateAndMainList(newList);
    }

    //delete item
    const deleteItem = (id: string) => {
        const modifiedItems = updatedList.items.filter((item) => item.id !== id);
        const newList = {...updatedList, items: modifiedItems, lastModified: new Date().toISOString()};
        updateStateAndMainList(newList);
    }

    //add or substract quantiry
    const quantityOperation = (id: string, quantity: number, operation: string) => {
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
                ? {...item, 
                    quantity: item.quantity + operator
                }
                : item
        )

        const newList = {...updatedList, items: modifiedItems, lastModified: new Date().toISOString()};
        updateStateAndMainList(newList);
    }

    //toggles between input menu and button
    const toggleInputingNewItem = () => {
        setIfIsInputingNewItem((prev) => prev = !prev);
    }

    //confirms new item, checks if item name was added and turns value of "" into 1
    const confirmNewItem = (name: string, quantity: string, unit: Unit) => {
        if(name.length === 0) {
            setItemAlertMessage(true);
            return;
        }
        if(quantity === "") quantity = "1";

        const newItem: GroceryItem = {
            id: Date.now().toString(),
            name: name,
            quantity: Number(quantity),
            checked: false,
            unit: unit,
        }

        const modifiedItems = [...updatedList.items, newItem];
        const newList = {...updatedList, items: modifiedItems};
        updateStateAndMainList(newList);
        resetInput();
    }

    //open new item input menu
    const handleNewItemInput = () => {
        resetInput();
        toggleInputingNewItem();
    }

    //resets input values on pressing confirm button
    const resetInput = () => {
        setInputItemName("");
        setInputQuantityValue("");
        setItemAlertMessage(false);
        setUnitType("");
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

    //translate map units
    const translateFromMap = (unit: Unit) => {
        if(unit === "") return t('none');
        if(unit === "lbs") return t('lbs');
        if(unit === "pcs") return t('pcs');
        if(unit === "oz") return t('oz');
        return unit;
    }

    return (
        <div className={styles.pageContainer}>
            <header className={styles.itemsPageHeader}>
                <button 
                    className={styles.itemsPageBackBtn} 
                    onClick={() => navigate('/')}
                >
                    <FaArrowLeft className={styles.itemsPageBackIcon}/>
                    {t('back')}
                </button>
                <h1>{updatedList.name}</h1>
            </header>
            <main className={styles.itemsPageMain}>
                <ul>
                    {updatedList.items.map((item) => (
                        <li key={item.id}>
                            <div className={styles.itemTopContainer}>
                                <div 
                                    className={styles.itemInputContainer} 
                                    onClick={() => toggleItemChecked(item.id)}
                                >
                                    <div 
                                        className={`${styles.itemCompletedToggle} ${item.checked === true ? `${styles.activeToggle}` : ''}`}
                                    >
                                        <FaCheck className={styles.checkIcon}/>
                                    </div>
                                    <button className={styles.itemBtn}>
                                        {item.name}
                                    </button>
                                    <p className={styles.itemQuantity}>
                                        {item.unit === "" ? "x" + item.quantity : item.quantity}
                                    </p>
                                    <p className={styles.itemQuantityType}>
                                        {(item.unit === "" || item.quantity === 0) ? "" : item.unit}
                                    </p>
                                </div>
                                <button 
                                    className={`${styles.itemMenuToggleBtn} ${expandedItemId === item.id ? `${styles.open}` : ""}`} 
                                    onClick={() => setExpandedItemId(prevId => prevId === item.id ? null : item.id)}
                                >
                                    <FaPen className={styles.penIcon}/>
                                </button>
                            </div>
                            {expandedItemId === item.id && (
                                <div className={styles.itemBtnsContainer}>
                                    <button className={styles.addOneItemBtn} onClick={() => quantityOperation(item.id, item.quantity, "add")}>+</button>
                                    <button className={styles.substractOneItemBtn} onClick={() => quantityOperation(item.id, item.quantity, "substract")}>-</button>
                                    <button className={styles.deleteItemBtn} onClick={() => deleteItem(item.id)}>{t('delete')}</button>
                                </div> 
                            )}
                        </li>
                    ))}
                </ul>
                <div 
                    className={styles.addNewItemContainer} 
                    ref={newItemInputMenuRef}
                >
                    {isInputingNewItem ? (
                        <div className={styles.addNewItemInputContainer}>
                            <input 
                                ref={newItemInputRef}
                                type="text" 
                                maxLength={32}
                                value={inputItemName}
                                className={styles.itemNameInput} 
                                placeholder={t('placeholderItemName')}
                                onChange={(e) => setInputItemName(e.target.value)}
                            />
                            {itemAlertMessage && 
                                <p className={styles.itemRequiredMessage}>{t('itemRequired')}</p>
                            }
                            <div className={styles.lowerNewItemInputContainer}>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="999" 
                                    value={inputQuantityValue} 
                                    className={styles.itemQuantityInput} 
                                    placeholder={t('placeholderQuantity')}
                                    onChange={(e) => handleQuantityInput(e, setInputQuantityValue)}
                                />
                                <select 
                                    id="unit-select" 
                                    value={unitType}
                                    className={styles.unitSelector}
                                    onChange={(e) => setUnitType(e.target.value as Unit)}
                                >   
                                    <option value={t('unit')} disabled>{t('unit')}</option>
                                    {units.map((unit) => (
                                        <option key={unit}>{translateFromMap(unit)}</option>
                                    ))}
                                </select>
                                <button 
                                    className={styles.confirmNewItem} 
                                    onClick={() => confirmNewItem(
                                        cleanInput(inputItemName), 
                                        inputQuantityValue, 
                                        String(unitType) === `${t('none')}` ? "" as Unit : unitType)
                                    }>
                                        <FaCheck className={styles.confirmIcon}/>
                                </button>
                                <button 
                                    className={styles.cancelNewItemProcess} 
                                    onClick={() => handleNewItemInput()}
                                >X</button>
                            </div> 
                        </div>
                    ) : (
                        <button className={styles.addNewItemBtn} onClick={() => handleNewItemInput()}>+</button>
                    )}
                </div>
            </main>
        </div>
    )
}

export default ItemsPage;