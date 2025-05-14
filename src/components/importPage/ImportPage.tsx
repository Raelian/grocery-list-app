import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { GroceryList } from "../../types/grocery";
import {decompressFromEncodedURIComponent} from "lz-string";
import styles from "./ImportedPage.module.scss";
import { useTranslation } from 'react-i18next';

interface ImportPageProps {
  addNewList: (input: string | GroceryList) => Promise<void>;
  justImported: boolean;
  setJustImported: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImportPage: React.FC<ImportPageProps> = ({ addNewList, justImported, setJustImported }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {t} = useTranslation();

  useEffect(() => {
    const importList = async () => {
      const encodedData = new URLSearchParams(location.search).get('data');

      if (!encodedData) {
        navigate("/"); // Redirect to home if no data
        return;
      }

      try {
        const jsonString = decompressFromEncodedURIComponent(encodedData);
        const importedList: GroceryList = JSON.parse(jsonString);

        // Add imported list using addNewList from App.tsx
        await addNewList(importedList);
      } catch (error) {
        console.error("Failed to decode or import list: ", error);
        navigate("/");
      }
    };

    // Call the importList function to handle the import
    importList();
  }, []);

  useEffect(() => {
    if(justImported) {
      setJustImported(false);
      navigate("/");
    }
  }, [justImported]);

  return <div className={styles.pageContainer}>
    <p>{t('importing')}</p>
  </div>
};

export default ImportPage;
