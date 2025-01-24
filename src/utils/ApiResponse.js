class ApiResponse{
    constructor(status , data , message="sucess")
    {
        this.status = status;
        this.data = data;
        this.message = message;
    }
}
export {ApiResponse}