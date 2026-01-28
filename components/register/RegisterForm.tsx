"use client";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import "./register.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth, provider, db } from "../../app/config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/redux/store";
import { loginThunk, registerThunk } from "@/app/redux/features/users/userSlice";
import { FormHelperText } from "@mui/material";
import './register.css'

const RegisterUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[A-Za-z ]+$/, "Name can only contain letters and spaces"),

  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .regex(/^\S*$/, "Password cannot contain spaces")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*]/, "Must contain at least one special character"),

  role: z.string("role is required"),
});

type RegisterFormInputs = z.infer<typeof RegisterUserSchema>;

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
    const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (!user.email) {
        throw new Error("Google account has no email");
      }
  
      const loginData = {
        email: user.email,
        password: "Google@123",
      };
  
      const loginResponse = await dispatch(loginThunk(loginData));
  
      if (loginThunk.fulfilled.match(loginResponse)) {
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        router.push('/')
  
        return;
      }
  
      const registerData = {
        name: user.email.split("@")[0],
        email: user.email,
        password: "Google@123",
        role: "CUSTOMER",
      };
  
      const registerResponse = await dispatch(registerThunk(registerData));
  
      if (!registerThunk.fulfilled.match(registerResponse)) {
        throw new Error("Registration failed");
      }
  
      const finalLogin = await dispatch(loginThunk(loginData));
  
      if (loginThunk.fulfilled.match(finalLogin)) {
        setSnackbarMessage("Account created & logged in!");
        setSnackbarOpen(true);
        router.push('/')
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Google sign-in failed");
      setSnackbarOpen(true);
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const response = await dispatch(registerThunk(data));
      if (response.type === 'auth/register/fulfilled') {
        setSnackbarMessage('User Registered Successfully!');
        setSnackbarOpen(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setSnackbarMessage(response.payload);
        setSnackbarOpen(true);
      }
    }
    catch (err: any) {
      setSnackbarMessage(err);
      setSnackbarOpen(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });


  useEffect(() => {
    console.log(errors)
  }, [errors])


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: 300,
            gap: 0.5,
          }}
        >

          <FormControl variant="standard">
            <TextField
              label="Name"
              variant="standard"
              size="small"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              label="Email"
              size="small"
              variant="standard"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <TextField
              label="Password"
              size="small"
              type={showPassword ? "text" : "password"}
              variant="standard"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl
            fullWidth
            variant="standard"
            size="small"
            error={!!errors.role}
          >
            <InputLabel
              id="demo-simple-select-standard-label"
              sx={{ fontSize: 14 }}
            >
              Role
            </InputLabel>

            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              {...register("role")}
              sx={{
                minHeight: 32,
                paddingY: "2px",
              }}
            >
              <MenuItem value="SELLER">Seller</MenuItem>
              <MenuItem value="CUSTOMER">Customer</MenuItem>
            </Select>

            <FormHelperText sx={{ fontSize: 11, mt: 0.5 }}>
              {errors.role?.message}
            </FormHelperText>
          </FormControl>


          <Button variant="contained" sx={{ mt: 1.5, mb: 1 }} type="submit">
            Register
          </Button>
        </Box>
      </form>
      <Button variant="contained" sx={{ mt: 1.5, borderRadius: "500px", width: 300, }} onClick={handleSignIn}>
        Sign in With Google
      </Button>

      <div
        className='login'><p>Already Registered <span className='login_link' onClick={() => { router.push('/login') }}>Login</span></p>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMessage}
      />
    </div>
  );
}
