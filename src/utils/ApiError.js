class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],// use to pass multiple errors
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null //read this.dat field
        this.success=false;
        this.errors=errors


        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }

    }//overwritting constructor
}
export {ApiError}