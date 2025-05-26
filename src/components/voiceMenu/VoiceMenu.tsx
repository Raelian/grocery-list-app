import { useState } from "react";
import styles from "./VoiceMenu.module.scss";
import {useTranslation} from 'react-i18next';

type TempItem = [string, string?, string?];
type recordState = 'record' | 'stop';

interface VoiceMenuProp {
    handleVoiceMenuInput: () => void;
}

function VoiceMenu({handleVoiceMenuInput}: VoiceMenuProp) {
    const { t } = useTranslation();
    const [recordingToggle, setRecordingToggle] = useState<recordState>('record');
    const [tempItemsList, setTempItemList] = useState<TempItem[]>([
        ["mere", "2", "kg"],
        ["salam", "3"],
        ["tort"]
    ]);

    const deleteTempItem = (key: string) => {
        console.log(tempItemsList);
        const newTempItemList = tempItemsList.filter((item) => {
            const [name, quantity, unit] = item;
            const itemKey = `${name}-${quantity || 1}-${unit || ""}`;

            if(key !== itemKey) return item;
        })

        setTempItemList(newTempItemList as TempItem[]);
    }

    const cancelVoiceMenu = () => {
        setTempItemList([]);//DON'T FORGET THAT THIS DELETES EVERYTHING IN THE TEMP LIST WHEN CANCELLED!!!!!
        handleVoiceMenuInput();
    }

    const confirmVoiceMenuList = () => {
        //add confirm code here
    }

    const handleVoiceRecording = () => {
        recordingToggle === 'record' ? setRecordingToggle('stop') : setRecordingToggle('record');
        //add voice recording code here
    }

    return (
        <div className={styles.voiceMenuContainer}>
            <div className={styles.voiceMenuSheet}>
                <h3>{t('recordedTitle')}</h3>
                <ul>
                    {tempItemsList.map((item) => {
                        const [name, quantity, unit] = item;
                        const key = `${name}-${quantity || 1}-${unit || ""}`;

                        return (
                            <li key={key}>
                                {name} {quantity || 1 } {unit || ""}
                                <button 
                                    className={styles.deleteTempItemBtn}
                                    onClick={() => deleteTempItem(key)}
                                >X</button>
                            </li>
                        );
                    })}
                </ul>
                <div className={styles.voiceMenuBtnsContainer}>
                    <button 
                        className={`${styles.recordSpeechToggleBtn} ${recordingToggle === 'stop' ? styles.stop : ""}`} 
                        onClick={() => handleVoiceRecording()}
                    >
                        {t(recordingToggle)}
                    </button>
                    <button 
                        className={styles.confirmSpeechItemsBtn} 
                        onClick={() => confirmVoiceMenuList()}
                    >
                        {t('confirm')}
                    </button>
                    <button className={styles.exitSpeechMenuBtn} onClick={() => cancelVoiceMenu()}>{t('cancel')}</button>
                </div>
            </div>
        </div>
    )
}

export default VoiceMenu;