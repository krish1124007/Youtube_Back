class ApiError extends Error{
    constructor(statusCode , message="SomeThing Went Wrong")
    {
        super(message);
        this.statusCode = statusCode;
    }
}

export {ApiError}