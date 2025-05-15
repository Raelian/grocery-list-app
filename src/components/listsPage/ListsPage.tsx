import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {GroceryList} from '../../types/grocery';
import { formatDate } from '../../types/timeFormat';
import {FaCheck, FaPen} from 'react-icons/fa';
import styles from "./ListsPage.module.scss";
import { cleanInput } from '../../utils/cleanInput';
import {useTranslation} from 'react-i18next';
import {saveLanguage} from '../../utils/languageStorage';
import { generateShareUrl } from '../../utils/share';

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
    const [infoVisibile, setInfoVisibility] = useState<boolean>(false);
    const newListInputRef = useRef<HTMLInputElement>(null);
    const [noListAlertMessage, setNoListAlertMessage] = useState<boolean>(false);
    const [listNameTooLongAlertMessage, setListNameTooLongAlertMessage] = useState<boolean>(false);
    const {i18n, t} = useTranslation();

    //handle share list URL
    const handleShare = (list: GroceryList) => {
        const shareUrl = generateShareUrl(list);
        navigator.clipboard.writeText(shareUrl);
    }

    //handle language change using i18n
    const toggleLanguage = async () => {
        const newLang = i18n.language === 'ro' ? 'en' : 'ro';
        await i18n.changeLanguage(newLang);
        await saveLanguage(newLang);
    }

    //new list container reference for closing when clicking outside div
    let newListContainerRef = useRef<HTMLDivElement | null>(null);

    //useEffect to detect when clickling outside newListContainer
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(!newListContainerRef.current?.contains(e.target as Node)){
                setIfIsInputingNewList(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

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
            setNoListAlertMessage(true);
            return;
        }
        
        if(input.length > 28) {
            setListNameTooLongAlertMessage(true);
            return;
        }

        addNewList(input);
        toggleInputingNewList();
        setNoListAlertMessage(false);
        setListNameTooLongAlertMessage(false);
        
    }

    //cancel making new list btn
    const openNewListInput = () => {
        setNewListName('');
        setNoListAlertMessage(false);
        setListNameTooLongAlertMessage(false);
        toggleInputingNewList();
    }

    //check if list complete
    const checkIfListComplete = (list: GroceryList) => {
        return list.items.length > 0 && list.items.every(item => item.checked);// first check if list isn't empty, then check if all items are checked(true)
    }

    return (
        <div className={styles.pageContainer}>
            <header className={styles.listPageHeader}>
                <h1>{t('lists')}</h1>
                <button 
                    className={styles.languageToggleBtn}
                    onClick={toggleLanguage}
                >
                    {i18n.language === 'ro' ? 'RO' : 'EN'}
                </button>
            </header>
            <main className={styles.listPageMain}>
                <ul>
                    {lists.map((list) => (
                        <li key={list.id}>
                            {expandedListId !== list.id ? (
                                <div className={styles.listLabelContainer}>
                                    <div className={`${styles.listCompletedToggle} ${checkIfListComplete(list) ? `${styles.activeToggle}` : ''}`}>
                                        <FaCheck className={styles.checkIcon}/>
                                    </div>
                                    <p className={styles.listNameLabel} onClick={() => navigate(`/lists/${list.id}`, { state: {list}})}>
                                       {list.name}
                                    </p>
                                    <button className={styles.listMenuToggleBtn} onClick={() => setExpandedListId(prevId => prevId === list.id ? null : list.id)}>
                                        <FaPen className={styles.penIcon}/>
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.listDropdownMenu}>
                                    <div className={styles.listDropdownMenuInfo} onClick={() => navigate(`/lists/${list.id}`, { state: {list}})}>
                                        <p>{list.name}</p>
                                        {infoVisibile && (
                                            <>
                                                <p>
                                                    <span>{t('status')} </span>
                                                    {list.items.length === 0
                                                        ? (t('list') + " " + t('empty'))
                                                        : checkIfListComplete(list)
                                                            ? (t('list') + " " + t('complete'))
                                                            : (t('list') + " " + t('incomplete'))
                                                    }
                                                </p>
                                                {checkIfListComplete(list) || list.items.length !== 0 && (
                                                    <p>
                                                        <span>{t('items')}</span>
                                                        {list.items.filter(item => item.checked).length} {t('outOf')} {list.items.length} {t('checked')}
                                                    </p>
                                                )}
                                                <p>
                                                    <span>{t('created')}</span>
                                                    {formatDate(list.creationDate)}
                                                </p>
                                                {list.creationDate !== list.lastModified && (
                                                    <p>
                                                        <span>{t('edited')}</span>
                                                        {formatDate(list.lastModified)}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.listDropdownMenuBtns}>
                                        {expandedDeleteListId !== list.id ? (
                                            <>
                                                <button 
                                                    className={styles.infoVisibleBtn} 
                                                    onClick={() => setInfoVisibility(prev => prev = !prev)}
                                                >
                                                    {infoVisibile ? t("hide") : t("info")}
                                                </button>                     
                                                <button 
                                                    className={styles.shareUrlBtn} 
                                                    onClick={() => handleShare(list)}
                                                >
                                                    {t('share')}
                                                </button>
                                                <button 
                                                    className={styles.deleteListBtn} 
                                                    onClick={() => setExpendedDeleteListId(prevId => prevId === list.id ? null : list.id)}
                                                >
                                                    {t('delete')}
                                                </button>
                                                <button 
                                                    className={styles.closeListBtn} 
                                                    onClick={() => setExpandedListId(prevId => prevId === list.id ? null : list.id)}
                                                >
                                                    {t('close')}
                                                </button>
                                            </>
                                        ) : (
                                            <>  
                                                <p className={styles.deletionText}>{t('deleteQuestion')}</p>
                                                <button className={styles.confirmDeletionBtn} onClick={() => deleteList(list.id)}>{t('yes')}</button>
                                                <button className={styles.cancelDeletionBtn} onClick={() => setExpendedDeleteListId(null)}>{t('no')}</button>
                                            </>
                                        )}
                                    </div> 
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className={styles.addNewListContainer} ref={newListContainerRef}>
                    {isInputingNewList ? (
                        <>
                            <div className={styles.addNewListInputContainer}>
                                <input 
                                    ref={newListInputRef}
                                    type="text"
                                    value={newListName}
                                    placeholder={t('placeholderListName')}
                                    maxLength={28}
                                    onChange={(e) => setNewListName(e.target.value)}
                                />
                                <button className={styles.confirmNewList} onClick={() => confirmNewList(cleanInput(newListName))}>
                                    <FaCheck className={styles.confirmIcon}/>
                                </button>
                                <button className={styles.cancelNewListProcess} onClick={() => toggleInputingNewList()}>X</button>
                            </div>
                        {noListAlertMessage && 
                            <p className={styles.alertMessage}>{t('listRequired')}</p>
                        }

                        {listNameTooLongAlertMessage &&
                            <p className={styles.alertMessage}>{t('nameTooLong')}</p>
                        }
                        </>
                        ) : (
                        <button className={styles.addNewListBtn} onClick={() => openNewListInput()}>+</button>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ListsPage;