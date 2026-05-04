const {loginService} = require("../services/auth.service")

async function loginController(req,res){
    const { email, password } = req.body;
    const result = await loginService(email, password);
    if (result.success === false) {
        return res.status(result.status).json(result)
    }

    if (result.success === true) {
        // Enviar token
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 36000000
        });
    
        return res.status(result.status).json({ message: result.message, user: result.user });
    }
}
module.exports = { loginController };