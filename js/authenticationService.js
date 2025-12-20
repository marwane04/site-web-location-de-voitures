// Helper to get all users
const getAllUsers = () => {

    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];

}

// Add a user to storage
export const addUserToStorage = (user) => {
    let users = getAllUsers();
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    user.id = maxId + 1;
    users.push(user);
    window.localStorage.setItem("users", JSON.stringify(users));
    return user;
}

// Register a new user
export const registerUser = (user) => {
    const users = getAllUsers();
    // if (users.some(u => u.email === user.email)) {
    //     throw new Error("Email already exists");
    // }
    // if (user.phone && users.some(u => u.phone === user.phone)) {
    //     throw new Error("Phone number already exists");
    // }
    return addUserToStorage(user);
}

// Login a user
export const loginUser = (email, password) => {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        authenticateUser(user);
        return user;
    }
    throw new Error("Invalid email or password");
}

// Set session for logged in user
export const authenticateUser = (user) => {
    window.sessionStorage.setItem("loggedInUser", user.id);
}

// Logout user
export const logoutUser = () => {
    window.sessionStorage.removeItem("loggedInUser");
}

// Get current logged in user
export const getCurrentUser = () => {
    const userId = window.sessionStorage.getItem("loggedInUser");
    if (!userId) return null;

    const users = getAllUsers();
    // Compare with == because storage stores strings
    return users.find(u => u.id == userId) || null;
}

// Check if user is authenticated
export const isAuthenticated = (userId = null) => {
    const loggedInId = window.sessionStorage.getItem("loggedInUser");
    if (!loggedInId) return false;

    if (userId) {
        return loggedInId === userId;
    }
    return true;
}
