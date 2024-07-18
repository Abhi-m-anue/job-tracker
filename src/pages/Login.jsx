import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios"

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "../styles/AuthenticationTitle.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("")

  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
        const user = await Axios.post('https://jobs-api-0v7l.onrender.com/api/v1/auth/login',{
            email,
            password
        })
        setError("")
        const token = user.data.token
        localStorage.setItem('jwtToken', token);
        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        navigate('/dashboard')
    }
    catch(err){
        setError(err.response.data.msg);
    }
    
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component={Link} to={"/register"}>
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            onChange={(e) => setEmail(e.target.value)}
            required
            error = {error ? true:false}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            error = {error}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group> */}
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
