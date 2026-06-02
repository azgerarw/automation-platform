import { createContext, useContext, useState } from "react";

const UiPreferencesContext = createContext<any>(null);

export const SettingsProvider = ({ children }: any) => {
  const [alertsEnabled, setAlerts] = useState<boolean | null>(false);

  return (
    <UiPreferencesContext.Provider value={{ alertsEnabled, setAlerts
     }}>
      {children}
    </UiPreferencesContext.Provider>
  );
};

export const useSettings = () => useContext(UiPreferencesContext);