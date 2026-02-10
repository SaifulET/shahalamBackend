import {
  createUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  generateOTP,
  verifyOTP,
  setNewPassword,
} from "./UserAuth.service.js";

/* SIGNUP */
export const signup = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      message: "User created",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(
      req.body.email,
      req.body.password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.sendStatus(401);
  }
};




/* REFRESH */
export const refresh = async (req, res) => {
  try {
    const { user, accessToken } = await refreshAccessToken(
      req.cookies.refreshToken
    );

    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.sendStatus(403);
  }
};

/* LOGOUT */
export const logout = async (req, res) => {
  await logoutUser(req.cookies.refreshToken);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};





export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = await generateOTP(email);

    // TODO: send OTP via email/SMS here

    res.json({ message: "OTP sent to your email/phone", otp }); // remove otp in production
  } catch (err) {
    console.log("keke",err)
    res.status(400).json({error:"failed", message: err.message });
  }
};

/* Verify OTP */
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyOTP(email, otp);
    res.json({ message: "OTP verified" });
  } catch (err) {
    
    res.status(400).json({error:'failed', message: err.message });
  }
};

/* Set New Password */
export const setNewPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    await setNewPassword(email,  newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};