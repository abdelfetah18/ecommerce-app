import { createContext } from "react";

export default createContext<UseUserSessionReturn>({
    isValid: false,
    isLoading: true,
    updateUserSession: (userSession: UserSession) => { userSession },
    userSession: { access_token: '', user: { username: '' } },
    clearSession: () => {}
});