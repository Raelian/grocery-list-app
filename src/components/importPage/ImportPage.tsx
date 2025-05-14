import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { GroceryList } from "../../types/grocery";
import {decompressFromEncodedURIComponent} from "lz-string";
import styles from "./ImportedPage.module.scss";
import { useTranslation } from 'react-i18next';

interface ImportPageProps {
  addNewList: (input: string | GroceryList) => Promise<void>;
}

const ImportPage: React.FC<ImportPageProps> = ({ addNewList }) => {
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
      } finally {
        navigate("/"); // After list is added, navigate to home
      }
    };

    // Call the importList function to handle the import
    importList();
  }, []); // Ensure these dependencies are correct to avoid unwanted loops

  return <div className={styles.pageContainer}>
    <p>{t('importing')}</p>
  </div>
};

export default ImportPage;
