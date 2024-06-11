import { useEffect, useState } from "react"

export default function useUserSession(): UseUserSessionReturn {
    const [userSession, setUserSession] = useState<UserSession>({ access_token: '', user: { username: '' } });
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        load();
        setIsLoading(false);
    }, []);

    const updateUserSession = (userSession: UserSession): void => {
        setUserSession(userSession);
        setIsValid(true);
        save(userSession);
    }

    const load = (): void => {
        const userSessionString = localStorage.getItem("userSession");
        if (userSessionString) {
            const session = JSON.parse(userSessionString) as UserSession;
            setUserSession(session);
            if (session.access_token.length > 0) {
                setIsValid(true);
            }
        }
    }

    const save = (userSession: UserSession): void => {
        localStorage.setItem('userSession', JSON.stringify(userSession));
    }

    const clearSession = (): void => {
        localStorage.removeItem("userSession");
        setIsValid(false);
        setUserSession({ access_token: '', user: { username: '' } });
    }

    return {
        isLoading, isValid, userSession, updateUserSession, clearSession
    };
}