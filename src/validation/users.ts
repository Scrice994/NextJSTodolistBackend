import * as yup from "yup";

const usernameSchema = yup.string()
    .max(20)
    .matches(/^[a-zA-Z0-9_]*$/); 

const emailSchema = yup.string().email();

const passwordSchema = yup.string()
    .matches(/^(?!.* )/)
    .min(6);

const tenantIdSchema = yup.string()
    .matches(/^[a-zA-Z0-9_]*$/)
    .max(30)

export const signUpSchema = yup.object({
    body: yup.object({
        username: usernameSchema.required(),
        email: emailSchema.required(),
        password: passwordSchema.required(),
        tenantId: tenantIdSchema,
        // verificationCode: yup.string().required()
    }),
});

export type SignUpBody = yup.InferType<typeof signUpSchema>["body"]; //le quadre per estrarre il body dal signup schema che se no sarebbe solo un oggetto che contiene un altro oggetto

export const loginSchema = yup.object({
    body: yup.object({
        username: usernameSchema.required(),
        password: passwordSchema.required()
    })
});

export type LoginBody = yup.InferType<typeof loginSchema>["body"];

export const resetPasswordSchema = yup.object({
    body: yup.object({
        email: emailSchema.required(),
        password: passwordSchema.required(),
        verificationCode: yup.string().required()
    }),
});

export type ResetPasswordBody = yup.InferType<typeof resetPasswordSchema>["body"];