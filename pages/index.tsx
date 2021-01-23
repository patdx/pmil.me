import classNames from "classnames";
import { FC } from "react";
import Container from "../components/container";
import Header from "../components/header";
import Layout from "../components/layout";
import markdownStyles from "../components/markdown-styles.module.css";

const Index: FC = () => {
  return (
    <Layout>
      <Container className="grid gap-4 pt-4">
        <Header></Header>
        <div
          className={classNames(
            "bg-gray-100 rounded-md p-8 shadow-lg",
            markdownStyles.markdown
          )}
        >
          <p>
            Hello! My name is Patrick Miller. I work as a software engineer in
            Osaka, Japan.
          </p>
          <p>
            I work on web and mobile applications using Angular, Ionic 4,
            Electron, etc.
          </p>
          <p>
            I also have past experience in QA, IT and mechanical engineering.
          </p>
          <p>
            Here are some various older projects that might be interesting. Feel
            free to contact me! Thank you.
          </p>
        </div>
      </Container>
    </Layout>
  );
};

export default Index;
