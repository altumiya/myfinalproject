const { userModel } = require("../../model/userModel");
const { transporter } = require("../../config/helper");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

let authController = {
  register: async (req, res) => {
    try {
      let { name, email, phone, address, password } = req.body;
      let checkEmail = await userModel.findOne({ email });
      if (checkEmail) {
        return res.send({
          status: 0,
          msg: "Email Id Already Exist..",
        });
      }

      const hash = bcrypt.hashSync(password, saltRounds);
      let obj = {
        name,
        email,
        phone,
        address,
        password: hash,
      };
      let userRes = await userModel.create(obj);
      return res.send({
        status: 1,
        msg: "User Created",
        userRes,
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).send({
        status: 0,
        msg: "Registration failed",
      });
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      let userData = await userModel.findOne({ email });

      if (!userData) {
        return res.send({
          status: 0,
          msg: "Email Id Not Found..",
        });
      }

      let dpPassword = userData.password;
      if (bcrypt.compareSync(password, dpPassword)) {
        let token = jwt.sign({ id: userData._id }, process.env.TOKENKEY || "secret");

        return res.send({
          status: 1,
          data: userData,
          token,
        });
      }

      return res.send({
        status: 0,
        msg: "Invalid  Password..",
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).send({
        status: 0,
        msg: "Login failed",
      });
    }
  },

  //After Login
  changePassword: async (req, res) => {
    let { oldPassword, newPassword, confirmPassword } = req.body;

    try {
      let token = req.headers.authorization.split(" ")[1]; //String

      let { id } = jwt.verify(token, process.env.TOKENKEY);

      let userData = await userModel.findOne({ _id: id });

      let dbPassword = userData.password;
      if (bcrypt.compareSync(oldPassword, dbPassword)) {
        if (newPassword == confirmPassword) {
          const hash = bcrypt.hashSync(newPassword, saltRounds);

          await userModel.updateOne(
            {
              _id: id,
            },
            {
              $set: {
                password: hash,
              },
            },
          );
          res.send({
            status: 1,
            message: "Password Changed",
          });
        } else {
          res.send({
            status: 0,
            message: "New Password or Confirm Password Not Matched",
          });
        }
      } else {
        res.send({
          status: 0,
          message: "Invalid Old Password",
        });
      }

      res.send("hello");
    } catch (err) {
      res.send({
        status: 0,
        message: "Please Send The Correct Token",
      });
    }

    //["Bearer","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNmExYTllMzdiZDRiNjZiNmRjMGNiMSIsImlhdCI6MTc4NTUwODkxNn0.5ylP5Q_UtQA2-qWQt66AF-kYEdZCLiWj4mbg43hPo7s"]
  },
  // Add this inside authController
  viewUsers: async (req, res) => {
    try {
      // Fetch all users but exclude the password field
      let users = await userModel.find({}).select("-password").sort({ createdAt: -1 });

      return res.send({
        status: 1,
        message: "Users fetched successfully",
        users: users,
      });
    } catch (error) {
      console.error("View users error:", error);
      return res.status(500).send({
        status: 0,
        message: "Failed to fetch users",
        error: error.message
      });
    }
  },
  updateProfile: async (req, res) => {
    let { phone, address, name } = req.body;
    let token = req.headers.authorization.split(" ")[1]; //String

    let { id } = jwt.verify(token, process.env.TOKENKEY);
    let updateObj = {
      phone,
      name,
      address,
    };

    if (req.file) {
      if (req.file.filename) {
        updateObj["image"] = req.file.filename;
      }
    }
    await userModel.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      },
    );
    res.send({
      status: 1,
      message: "Profile Update",
    });
  },
  forgotPassword: async (req, res) => {
    try {
      let { email } = req.body;
      let checkEmail = await userModel.findOne({ email });

      if (!checkEmail) {
        return res.send({
          status: 0,
          message: "Email Id Not Found",
        });
      }
      const resetToken = jwt.sign(
        { _id: checkEmail._id },
        process.env.TOKENKEY || "secret",
        { expiresIn: "15m" } // <-- This makes the link expire!
      );
      // Check if APPURL is actually defined in your .env
      const appUrl = process.env.APPURL || "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password/${resetToken}`;

      const emailHtml = `
        <div style="margin:0;padding:32px 16px;background-color:#f4efe8;font-family:Arial,sans-serif;color:#2f241f;">
          <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(62,39,27,0.12);">
            <div style="background:linear-gradient(135deg,#6f4e37,#b08968);padding:36px 32px;text-align:center;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f7ede2;">
                Furniture Website
              </p>
              <h1 style="margin:0;font-size:30px;line-height:38px;color:#ffffff;">
                Reset your password
              </h1>
            </div>
            <div style="padding:36px 32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:26px;">
                Hi ${checkEmail.name || "there"},
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:26px;color:#5b4638;">
                We received a request to reset your account password. Click the button below to choose a new password and get back into your account.
              </p>
              <div style="margin:32px 0;text-align:center;">
                <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;background-color:#6f4e37;color:#ffffff;text-decoration:none;border-radius:999px;font-size:15px;font-weight:700;">
                  Reset Password
                </a>
              </div>
              <p style="margin:0 0 12px;font-size:14px;line-height:24px;color:#7a6658;">
                If the button does not work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 20px;font-size:13px;line-height:22px;word-break:break-all;color:#6f4e37;">
                ${resetUrl}
              </p>
            </div>
          </div>
        </div>
      `;

      // Wait for the email to send
      await transporter.sendMail({
        from: '"Furniture Website Reset Password" <pradeep.9997@gmail.com>',
        to: email,
        subject: "Reset Your Password",
        text: `Reset your password using this link: ${resetUrl}`,
        html: emailHtml,
      });

      return res.send({
        status: 1,
        message: "Reset Password Link Sent To Your Email",
      });

    } catch (error) {
      // THIS will log exactly why it's failing in your backend terminal
      console.error("FORGOT PASSWORD ERROR:", error);

      return res.status(500).send({
        status: 0,
        message: "Internal Server Error while sending email",
        error: error.message
      });
    }
  },
 resetPassword: async (req, res) => {
    let { password } = req.body;
    let { token } = req.params;

    try {
      let decoded = jwt.verify(token, process.env.TOKENKEY || "secret");
      
      const hash = bcrypt.hashSync(password, saltRounds);

      let updateRes = await userModel.updateOne(
        { _id: decoded._id },
        { $set: { password: hash } }
      );

      res.send({
        status: 1,
        message: "Password has been reset successfully. Please login.",
        updateRes,
      });

    } catch (err) {
      console.error("Reset Password Error:", err.message);
      
      res.send({
        status: 0,
        message: err.name === "TokenExpiredError" 
          ? "Reset Password Link has expired. Please request a new one." 
          : "Invalid Reset Password Link.",
      });
    }
  },
};

module.exports = authController;