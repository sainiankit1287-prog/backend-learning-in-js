const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler()).catch((err)=>next(err))
    }
}


export {asyncHandler}







/*
const asyncHandler=()=>{}
const asyncHandler=(func)=>{()=>} // this starting '{' remove
const asyncHandler=(func)=>async()=>{}// async() excute the fuction
*/

/*
const asyncHandler=(fn)=>async (req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success:false,// flag
            message:error.message
        }) //.json() is send json response
    }
}
    */