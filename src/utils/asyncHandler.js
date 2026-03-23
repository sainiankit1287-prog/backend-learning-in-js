const asyncHandler=(requestHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err)) // you must passed req,res,next to reqestHandler
    }
} // to make higher order function you return it


export {asyncHandler}







/*  higher order function
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