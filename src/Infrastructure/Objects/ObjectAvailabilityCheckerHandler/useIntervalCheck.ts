import { useEffect, useRef } from 'react';
import Config from 'react-native-config';

// Определяем тип для функции обратного вызова
type CallbackFunction = () => void;

const useIntervalCheck = (callback: CallbackFunction): void => {
    const callbackRef = useRef<CallbackFunction>(callback);
    const intervalCheckServices = Number(Config.PERIOD_INTERVAL_CHECK_SERVICES)
    // Обновляем ref, чтобы он всегда содержал актуальную функцию
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            // Вызываем функцию, хранящуюся в ref
            callbackRef.current();
        };

        const intervalId = setInterval(tick, intervalCheckServices); // Таймер запускается без условия
        return () => clearInterval(intervalId); // Очистка таймера при размонтировании
    }, [callback]); // Эффект выполняется только при изменении функции callback
};

export default useIntervalCheck;
