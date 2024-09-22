// Import the mongoose library and the Schema constructor from mongoose.
// mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js,
// which provides a straightforward, schema-based solution to model your application data.
import mongoose, { Schema } from "mongoose";

// Import the jsonwebtoken library, used for creating and verifying JSON Web Tokens (JWTs),
// which are often used for authentication and secure information exchange.
import jwt from "jsonwebtoken";

// Import the bcrypt library, which is used to hash passwords before storing them in the database
// and to compare a given password with a stored hashed password during login.
import bcrypt from "bcrypt";

// Define a schema for the User model using mongoose's Schema constructor.
// The schema defines the structure of documents within a MongoDB collection.
const userSchema = new Schema(
    {
        // The 'username' field is a string, required, unique, and indexed for fast querying.
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Converts the value to lowercase before saving
            trim: true, // Removes leading and trailing whitespace
            index: true // Creates an index on the username field
        },
        // The 'email' field is also a string, required, unique, and trimmed.
        // Note: There's a typo 'lowecase' that should be 'lowercase'.
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Converts the value to lowercase before saving
            trim: true, // Removes leading and trailing whitespace
        },
        // The 'fullName' field is a required string, trimmed, and indexed for fast querying.
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        // The 'avatar' field is a required string that stores the URL of the user's avatar image,
        // typically hosted on a service like Cloudinary.
        avatar: {
            type: String, // URL string
            required: true,
        },
        // The 'coverImage' field is an optional string that stores the URL of the user's cover image.
        coverImage: {
            type: String, // URL string
        },
        // The 'watchHistory' field is an array of ObjectIds that reference 'Video' documents.
        // This is a relation to another collection where each entry in the array is an ObjectId of a video.
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video" // References the 'Video' model
            }
        ],
        // The 'password' field is a required string that stores the user's hashed password.
        password: {
            type: String,
            required: [true, 'Password is required'] // Custom error message if password is not provided
        },
        // The 'refreshToken' field is an optional string that stores the user's refresh token.
        refreshToken: {
            type: String
        }
    },
    {
        // This adds 'createdAt' and 'updatedAt' fields to the schema, which store timestamps.
        timestamps: true
    }
);

// A pre-save hook that runs before a user document is saved to the database.
// It checks if the password field has been modified; if so, it hashes the new password.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // If the password is not modified, move to the next middleware

    this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10
    next(); // Call the next middleware or save the document
});

// Instance method to compare a given password with the stored hashed password.
// This is used during login to verify the user's credentials.
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password); // Returns true if the passwords match
};

// Instance method to generate a JWT access token.
// This token includes the user's ID, email, username, and fullName, and is signed with a secret key.
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id, // User ID
            email: this.email, // User email
            username: this.username, // User username
            fullName: this.fullName // User full name
        },
        process.env.ACCESS_TOKEN_SECRET, // Secret key to sign the token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Expiration time for the token
        }
    );
};

// Instance method to generate a JWT refresh token.
// This token includes only the user's ID and is used to issue new access tokens.
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id, // User ID
        },
        process.env.REFRESH_TOKEN_SECRET, // Secret key to sign the refresh token
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Expiration time for the refresh token
        }
    );
};

// Create a model from the userSchema and export it.
// The 'User' model represents the 'users' collection in the MongoDB database.
export const User = mongoose.model("User", userSchema);
