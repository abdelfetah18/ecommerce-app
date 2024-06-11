import client from "../database/client";

export const USER_PROPS = `{ _id, username, role, "profile_image" : profile_image.asset-> }`;
export const USER_WITH_EMAIL_PROPS = `{ _id, username, role, email, "profile_image" : profile_image.asset-> }`;
export const USER_WITH_PASSOWRD_PROPS = `{ _id, username, role, email, password, "profile_image" : profile_image.asset-> }`;

export const getUserById = async (userId: string): Promise<User | null> => {
    return await client.fetch<User>(`*[_type == "users" && _id == $userId]${USER_PROPS}[0]`, { userId });
}

export const getUserByUsername = async (username: string): Promise<User | null> => {
    return await client.fetch<User>(`*[_type == "users" && username == $username]${USER_PROPS}[0]`, { username });
}

export const getUserWithPassword = async (username: string): Promise<User | null> => {
    return await client.fetch<User>(`*[_type == "users" && username == $username]${USER_WITH_PASSOWRD_PROPS}[0]`, { username });
}

export const getUserWithEmail = async (username: string): Promise<User | null> => {
    return await client.fetch<User>(`*[_type == "users" && username == $username]${USER_WITH_EMAIL_PROPS}[0]`, { username });
}

export const getUserWithEmailById = async (userId: string): Promise<User | null> => {
    return await client.fetch<User>(`*[_type == "users" && _id == $userId]${USER_WITH_EMAIL_PROPS}[0]`, { userId });
}

export const updateUser = async (user: User): Promise<void> => {
    const profileImage = user.profile_image ? { _type: 'image', asset: { _type: "reference", _ref: user.profile_image._id } } : undefined;
    const userDoc = { _type: "users", ...user, profile_image: profileImage };
    await client.patch(user._id).set(userDoc).commit();
}

export const createUser = async (user: User) => {
    const userDoc = { _type: "users", username: user.username, email: user.email, password: user.password, role: "user", email_verify: false, sign_up_with: "email" };
    return await client.create(userDoc);
}
