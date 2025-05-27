import { useState, useEffect, useRef } from "react";
import styles from "./VoiceMenu.module.scss";
import {useTranslation} from 'react-i18next';
import { parseTranscript} from "../../utils/languageParserPicker";
import { TempItem } from "../../types/tempParserList";

type recordState = 'record' | 'stop';

interface VoiceMenuProp {
    handleVoiceMenuInput: () => void;
    addNewSpeechItems: (list: TempItem[]) => void;
}

function VoiceMenu({handleVoiceMenuInput, addNewSpeechItems}: VoiceMenuProp) {
    const { t, i18n } = useTranslation();
    const [recordingToggle, setRecordingToggle] = useState<recordState>('record');
    const [tempItemsList, setTempItemList] = useState<TempItem[]>([]);
    const recognitionRef = useRef<any>(null);
    const langOption: Record<string, string> = {
        en: 'en-US',
        ro: 'ro-RO'
    };

    useEffect(() => {
        //speech recognition API setup
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = langOption[i18n.language] || 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognitionRef.current = recognition;

        //parse recording
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            console.log("Heard: ", transcript);
            const lang = i18n.language;

            const parsed: TempItem = parseTranscript(transcript, lang);
            const [item, quantity = "1", unit] = parsed;
            console.log("Item: ", item, "Quantity: ", quantity, "Unit: ", unit)
            const key = `${item}-${quantity}-${unit || ""}`;

            setTempItemList(prev => {
                if (!prev.some(i => `${i[0]}-${i[1] || 1}-${i[2] || ""}` === key)) {
                    return [...prev, [item, quantity, unit]];
                }
                return prev;
            });
        }

        recognition.onerror = (event: any) => {
            console.log('Speech recognition error: ', event.error);
            setRecordingToggle('record');
        }

        recognition.onend = () => {
            setRecordingToggle('record');
        }

        return () => {
            recognition.stop(); // cleanup
        };
    }, [])
    

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
        addNewSpeechItems(tempItemsList);
        handleVoiceMenuInput();
    }

    //start/stop recording
    const handleVoiceRecording = () => {
        const recognition = recognitionRef.current;
        if(!recognition) return;

        if(recordingToggle === 'record') {
            recognition.start();
            setRecordingToggle('stop');
        } else {
            recognition.stop();
            setRecordingToggle('record');
        }
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
                                {name} {unit === undefined ? "x" : "-"} {quantity || 1 } {unit || ""}
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