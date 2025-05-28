import React from "react";
import {Unit} from "../../types/grocery";
import styles from "./UnitSelector.module.scss";
import { translateFromSelector } from "../../utils/translateUnits";
import {useTranslation} from "react-i18next";

interface UnitSelectorProps {
    value: Unit;
    handleChange: (value: Unit, itemId?: string) => void;
    units: Unit[]; 
}

const UnitSelector: React.FC<UnitSelectorProps> = ({value, handleChange, units}) => {
    const {t} = useTranslation();

    //translate map units
    const translateFromMap = (unit: Unit) => {
        if(unit === "pcs") return t('pcs');
        return unit;
    }

    return (
        <select 
            value={value}
            className={styles.unitSelector}
            onChange={(e) => handleChange(e.target.value as Unit)}
        >   
            <option value={t('unit')} disabled>{t('unit')}</option>
            {units.map((unit) => (
                <option key={unit}>{translateFromSelector(unit)}</option>
            ))}
        </select>
    );
};

export default UnitSelector;