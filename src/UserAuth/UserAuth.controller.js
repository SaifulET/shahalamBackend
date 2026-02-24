import {
  createUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  generateOTP,
  verifyOTP,
  setNewPassword,getUserByIdService,
  updateProfile,
  loginCompany,
  changePassword,
  loginSuperAdmin,
  getUserStatsService,
  setAdminNewPassword
} from "./UserAuth.service.js";

/* SIGNUP */
export const signup = async (req, res) => {
  try {
    const data= req.body;
     if(req.file){
      data.image=data.image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;
    }
    const user = await createUser(data);
    
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
    const role = req.body.role || "user"; 
    const { user, accessToken, refreshToken } = await loginUser(
      req.body.email,
      req.body.password,
      role
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
        id: user.id,
        name: user.name,
        email: user.email,
       profileImage:user.profileImage,
        role: user.role,
      },
    });
  } catch {
    res.sendStatus(401);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const role = req.body.role || "superadmin"; 
    const { user, accessToken, refreshToken } = await loginSuperAdmin(
      req.body.email,
      req.body.password,
      role
    );
// console.log("dkd",user._id.toString(),"user")
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone:user.phone,
        profileImage:user.profileImage,
        role: user.role,
      },
    });
  } catch {
    res.sendStatus(401);
  }
};






export const loginCompanyController = async (req, res) => {
  try {
   
    const role = 'admin'; 
    const { user, accessToken, refreshToken } = await loginCompany(
      req.body.email,
      req.body.password,
      role
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
        profileImage: user.profileImage,
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
        profileImage:user.profileImage,
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

    res.json({ message: "OTP sent to your email/phone" }); // remove otp in production
  } catch (err) {
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



export const setAdminNewPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
   
    await setAdminNewPassword(email,  newPassword);
    console.log("updatedd")
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};







// ✅ Get User Info
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const editProfile = async (req, res) => {
  const userId = req.params.userId; // assuming you have auth middleware
  const profileData = req.body;
    if(req.file){ 
      profileData.profileImage = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;
    }
  try {
    const updatedUser = await updateProfile(userId, profileData);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};





export const changePasswordController = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await changePassword(userId, currentPassword, newPassword);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




export const getUserStatsController = async (req, res) => {
  try {

    const { userId } = req.params;

    const stats = await getUserStatsService(userId);

    return res.status(200).json({
      success: true,
      message: "User dashboard stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};