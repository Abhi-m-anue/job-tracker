import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "../styles/NotFoundTitle.module.css";
import { Link } from "react-router-dom";

const UnAuthorised = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Invalid Page Request.</Title>
      <div style={{display:"flex", justifyContent:"center",padding:"40px 0"}}>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            You don't have access to this page or your session expired, please login
            to continue.
          </Text>
      </div>
      <Group justify="center">
        <Link to={"/"}>
          <Button variant="subtle" size="md">
            Take me back to login page
          </Button>
        </Link>
      </Group>
    </Container>
  );
};

export default UnAuthorised;
