import classNames from 'classnames';
import { FC } from 'react';
import Container from '../components/container';
import Header from '../components/header';
import Layout from '../components/layout';
import Head from 'next/head';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
// import markdownStyles from "../components/markdown-styles.module.css";

const Index: FC = () => {
  return (
    <>
      <NextSeo title="Patrick Miller" />
      <Layout>
        <Container className="grid gap-4 py-4">
          <Header></Header>
          {/* <div className="rounded-md p-8 shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4 border-gray-200 border"></div> */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-4">
            <div className={classNames('col-span-2', 'prose')}>
              <p>
                Hello! My name is Patrick Miller. I have been working as a
                software engineer in Osaka, Japan for several years.
              </p>
              <p>
                I work on web and hybrid mobile applications using Angular,
                Ionic, Electron, React, etc.
              </p>
              <p>
                I also have past experience in QA, IT and mechanical
                engineering.
              </p>
              <p>
                Here are some various hobby projects that might be interesting.
                Feel free to contact me! Thank you.
              </p>
            </div>
            <div>
              <Image
                layout="responsive"
                width={3024}
                height={3024}
                className="rounded-lg"
                src="/assets/img/patrick.jpg"
                alt="Picture of Patrick Miller"
              />
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Index;
