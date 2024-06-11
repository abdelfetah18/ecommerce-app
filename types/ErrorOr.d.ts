interface ErrorOr<T> {
    isError: boolean;
    value?: T;
    message?: string;
};