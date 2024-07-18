import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

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
import { useToggle, upperFirst } from "@mantine/hooks";
import classes from "../styles/AuthenticationTitle.module.css";

const LoginRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [type, toggle] = useToggle(["login", "register"]);

  const navigate = useNavigate();

  const handleRegister = async(e)=>{
    e.preventDefault();
    try{
        const user = await Axios.post(
          "https://jobs-api-0v7l.onrender.com/api/v1/auth/register",
          {
            name,
            email,
            password
          }
        );
        setError("");
        const token = user.data.token;
        localStorage.setItem("jwtToken", token);
        Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        toggle();
    }
    catch(err){
        if (err.response.data.msg === "Duplicate value entered for email"){
            setError('This email is already registered, try login in');
        }
        else{
            setError("Invalid format");
        }
        
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await Axios.post(
        "https://jobs-api-0v7l.onrender.com/api/v1/auth/login",
        {
          email,
          password,
        }
      );
      setError("");
      const token = user.data.token;
      localStorage.setItem("jwtToken", token);
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        {type === "login" ? "Welcome back!" : "Get started!"}
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={type === "login" ? handleLogin : handleRegister}>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name (min. 3 characters)"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              error={error ? true : false}
            />
          )}
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            onChange={(e) => setEmail(e.target.value)}
            required
            error={error ? true : false}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password (min. 6 characters)"
            required
            mt="md"
            error={error}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginRegister;
