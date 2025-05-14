import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { GroceryItem, GroceryList } from "../../types/grocery";
import {decompressFromEncodedURIComponent} from "lz-string";
import styles from "./ImportedPage.module.scss";
import { useTranslation } from 'react-i18next';

interface ImportPageProps {
  addNewList: (input: string | GroceryList) => Promise<void>;
}

const ImportPage: React.FC<ImportPageProps> = ({ addNewList}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {t} = useTranslation();

  const isValidGroceryList = (data: any): data is GroceryList => {
    return (
      typeof data === "object" &&
      typeof data.id === "string" &&
      typeof data.name === "string" &&
      Array.isArray(data.items) &&
      typeof data.creationDate === "string" &&
      typeof data.lastModified === "string" &&
      data.items.every((item: GroceryItem) =>
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.checked === "boolean"
      )
    );
  };

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

        if(!isValidGroceryList(importedList)) {
          throw new Error("Invalid list format!");
        }

        // Add imported list using addNewList from App.tsx
        await addNewList(importedList);
      } catch (error) {
        console.error("Failed to decode or import list: ", error);
      } finally {
        setTimeout(() => navigate("/"), 5000);
      }
    };

    // Call the importList function to handle the import
    importList();
  }, []);

  return <div className={styles.pageContainer}>
    <p className={styles.importMessage}>{t('importing')}</p>
  </div>
};

export default ImportPage;
