import classNames from "classnames";
import { FC } from "react";
import Container from "../components/container";
import Header from "../components/header";
import Layout from "../components/layout";
import Head from "next/head";
import { NextSeo } from "next-seo";
// import markdownStyles from "../components/markdown-styles.module.css";

const Index: FC = () => {
  return (
    <>
      <NextSeo title="Patrick Miller" />
      <Layout>
        <Container className="grid gap-4 py-4">
          <Header></Header>
          <div className="bg-gray-100 rounded-md p-8 shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={classNames("col-span-2", "prose")}>
              <p>
                Hello! My name is Patrick Miller. I work as a software engineer
                in Osaka, Japan.
              </p>
              <p>
                I work on web and mobile applications using Angular, Ionic 4,
                Electron, etc.
              </p>
              <p>
                I also have past experience in QA, IT and mechanical
                engineering.
              </p>
              <p>
                Here are some various older projects that might be interesting.
                Feel free to contact me! Thank you.
              </p>
            </div>
            <div>
              <div className="aspect-w-1 aspect-h-1">
                <img src="/assets/img/patrick-arashiyama.jpg"></img>
              </div>
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Index;
