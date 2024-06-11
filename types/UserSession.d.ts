interface UserSession {
    access_token: string;
    user: User;
};

interface UseUserSessionReturn {
    isValid: boolean;
    isLoading: boolean;
    userSession: UserSession;
    updateUserSession: (userSession: UserSession) => void;
    clearSession: () => void;
}