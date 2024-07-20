import { Container, Group, Burger, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "../styles/HeaderSimple.module.css";

import { useNavigate } from "react-router-dom";


export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Text size="xl" fw={900} variant="gradient" gradient={{ deg: 100 }}>
          Job Tracker
        </Text>
        <Group gap={5} >
          <a
            className={classes.link}
            data-active={true}
            onClick={(event) => {   
              event.preventDefault();
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </a>
        </Group>
      </Container>
    </header>
  );
}

export default Header
