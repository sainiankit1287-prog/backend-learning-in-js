import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistsScheme = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true            
        },
        //this schema only store single value so use array
        // videos:{
        //     type:Schema.Types.ObjectId,
        //     ref:"Video"
        // },
        videos:[// this can store multiple values 
            {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}
)


playlistsScheme.path("videos").default([]);//it ensure array empty initially
export const Playlist=mongoose.model("Playlist",playlistsScheme)