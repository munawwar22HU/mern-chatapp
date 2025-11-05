const signup = (req, res) => {
    res.send("Signup Route");
};

const login = (req, res) => {
    res.send("Login Route");
};

const logout = (req, res) => {
    res.send("Logout Route");
};

export { signup, login, logout };
