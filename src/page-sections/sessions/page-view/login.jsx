"use client";

import Link from "next/link";
import { useState } from "react";
import { Grid, Divider, TextField, Box, Checkbox, styled, ButtonBase } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import { useFormik } from "formik"; // CUSTOM DEFINED HOOK
import Layout from "../Layout"; // CUSTOM COMPONENTS

import { H5, H6, Paragraph } from "components/typography";
import { FlexBetween, FlexBox, FlexRowAlign } from "components/flexbox"; // CUSTOM ICON COMPONENTS
import { signIn } from "next-auth/react";
import SwalBasic from "components/error/SwalBasic";
import { useRouter, useSearchParams } from "next/navigation";


const StyledButton = styled(ButtonBase)(({
  theme
}) => ({
  padding: 12,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`
}));

const LoginPageView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    remember: true
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("이메일 형식을 지켜주세요.").max(255).required("이메일을 입력해주세요."),
    password: Yup.string().required("비밀번호를 입력해주세요.")
  });
  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    
  } = useFormik({
    initialValues,
    validationSchema,
  });

  const query = useSearchParams();
  const callBackUrl = query.get("callbackUrl");
  const router = useRouter();

  // 로그인
  const handleLogin = async () => {
    if(values.email === "" || values.password === "") {
      SwalBasic({ text: "이메일 , 비밀번호를 모두 입력해주세요.", position: "center" });
    } else {
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
          callbackUrl: callBackUrl ? callBackUrl : "/",
        });
        if (!result || !result.ok) {
          SwalBasic({ text: "아이디 비밀번호 확인 후 다시 시도해주세요.", position: "center" });
        } else {
          SwalBasic({ text: "우야노에 오신걸 환영합니다.", position: "center" });
          router.push("/")
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return <Layout login>
      <Box maxWidth={550} p={4}>
        <H5 fontSize={{
        sm: 30,
        xs: 25
      }}>Sign In</H5>

        <Paragraph mt={1} mb={6} color="text.secondary">
          처음이신가요?{" "}
          <Box fontWeight={800} component={Link} href="/register">
            회원가입하기
          </Box>
        </Paragraph>

        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <H6 fontSize={16} mb={1.5}>
                Login with your email id
              </H6>

              <TextField fullWidth placeholder="ex) wooyano@example.com" name="email" onBlur={handleBlur} value={values.email} onChange={handleChange} helperText={touched.email && errors.email} error={Boolean(touched.email && errors.email)} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth placeholder="Password" type={showPassword ? "text" : "password"} name="password" onBlur={handleBlur} value={values.password} onChange={handleChange} helperText={touched.password && errors.password} error={Boolean(touched.password && errors.password)} InputProps={{
              endAdornment: <FlexRowAlign onClick={() => setShowPassword(!showPassword)} sx={{
                cursor: "pointer"
              }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </FlexRowAlign>
            }} />

              <FlexBetween my={1}>
                <FlexBox alignItems="center" gap={1}>
                  <Checkbox sx={{
                  p: 0
                }} name="remember" value={values.remember} onChange={handleChange} checked={values.remember} />
                  <Paragraph fontWeight={500}>Remember me</Paragraph>
                </FlexBox>

                <Box fontSize={13} component={Link} href="/forget-password" sx={{
                color: "error.500",
                fontWeight: 500
              }}>
                  Forget Password?
                </Box>
              </FlexBetween>
            </Grid>

            <Grid item xs={12}>
              <LoadingButton loading={isLoading} variant="contained" fullWidth onClick={handleLogin}>
                Sign In
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>;
};

export default LoginPageView;