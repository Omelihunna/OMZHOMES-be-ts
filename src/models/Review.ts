import { ObjectId } from 'mongodb';
import { Schema, model } from  'mongoose';

interface Author {
    type: ObjectId,
    ref: string
}

interface Review {
    body: string;
    rating: number;
    author: Author;
}

const  reviewSchema = new Schema <Review> ({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

export default model ("Review", reviewSchema);