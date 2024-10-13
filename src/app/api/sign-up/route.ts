import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // destruct data from request json
    const { username, email, password } = await request.json();

    // find user is present in db or not
    const existingUserVerifiedByUsername = await UserModel.find({
      username,
      isVerified: true,
    });

    console.log("request:==", existingUserVerifiedByUsername, username)


    if (existingUserVerifiedByUsername.length>0) {
      return Response.json(
        {
          success: false,
          message: "User is already exist",
        },
        {
          status: 500,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified){
        return Response.json(
            {
              success: false,
              message: "User already exist with email",
            },
            { status: 500 }
          );

      }else{
        // if user is not verified by email then update existing user
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode= verifyCode;
        existingUserByEmail.verifyCodeExpiry= new Date(Date.now()+ 3600000)

        await existingUserByEmail.save()
    }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // Created new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      // save user in DB
      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User register successfully. Please verify your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: `Error registering user: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}
