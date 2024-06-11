type HttpResponseStatus = 'success' | 'error';

interface HttpResponse<Type> {
    status: HttpResponseStatus;
    data?: Type;
    message?: string;
};