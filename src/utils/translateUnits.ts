import { Unit } from "../types/grocery";
import {useTranslation} from "react-i18next";

export const translateFromSelector = (unit: Unit) => {
    const {t} = useTranslation();

    if(unit === "pcs") return t('pcs');
    return unit; 
};

