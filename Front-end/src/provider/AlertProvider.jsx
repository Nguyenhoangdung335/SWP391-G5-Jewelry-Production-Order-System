    import React, { createContext, useState, useContext } from "react";
    import CustomAlert from "../reusable/CustomAlert";

    const AlertContext = createContext();

    export const useAlert = () => useContext(AlertContext);

    export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = (title, text, isShow, onClose, variant, autoCloseTime = 5500) => {
        const id = new Date().getTime();
        setAlerts([...alerts, { id, title, text, variant, autoCloseTime }]);
    };

    const removeAlert = (id) => {
        setAlerts(alerts.filter((alert) => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
        {children}
        {alerts.map((alert) => (
            <CustomAlert
            key={alert.id}
            title={alert.title}
            text={alert.text}
            isShow={true}
            alertVariant={alert.variant}
            autoCloseTime={alert.autoCloseTime}
            onClose={() => removeAlert(alert.id)}
            />
        ))}
        </AlertContext.Provider>
    );
    };