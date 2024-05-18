import { Profile, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User, FederatedCredential, IUser, IFederatedCredential } from '../models/User'; // Adjust the path to your models

class GoogleAuthService {
    static async verify(issuer: string, profile: Profile, cb: (err: any, user?: any) => void) {
        try {
            const federatedCredential = await FederatedCredential.findOne({ provider: issuer, subject: profile.id });

            if (!federatedCredential) {
                // Create a new user if not found
                const user = new User({ username: profile.displayName, email: profile.emails![0].value || null });

                await user.save();

                const newFederatedCredential = new FederatedCredential({
                    userId: user._id,
                    provider: issuer,
                    subject: profile.id,
                });
                await newFederatedCredential.save();

                return cb(null, user);
            } else {
                // Find the existing user
                const user = await User.findById(federatedCredential.userId);
                if (!user) {
                    return cb(null, false);
                }
                return cb(null, user);
            }
        } catch (err) {
            return cb(err);
        }
    }
}

export { GoogleAuthService };
