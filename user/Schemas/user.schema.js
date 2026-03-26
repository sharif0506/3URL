import {z} from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1, "Firstname is required"),
    lastName: z.string().min(1, "Lastname is required"),
    email: z.email("Invalid email format"),
    country: z.string().length(2, "Country code must be 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    retypePassword: z.string()
}).refine(data => data.password === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"]
});

export const loginUserSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

export const userForgotPasswordSchema = z.object({
    email: z.email("Invalid email format")
});


export const userResetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    retypePassword: z.string()
}).refine(data => data.password === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"]
});