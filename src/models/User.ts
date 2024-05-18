import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

export interface IUser {
    _id: ObjectId;
    email: string;
    username: string;
    hash: string;
}

export interface IFederatedCredential extends Document {
    userId: ObjectId;
    provider: string;
    subject: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    }
})

const federatedCredentialSchema = new Schema<IFederatedCredential>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, required: true },
    subject: { type: String, required: true },
});

UserSchema.plugin(passportLocalMongoose);
const User = model("User", UserSchema)
const FederatedCredential = model<IFederatedCredential>("FederalCredential", federatedCredentialSchema)

export { User, FederatedCredential };