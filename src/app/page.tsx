import clsx from 'clsx';
// import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { FC } from 'react';
import Container from '../components/container';
import Layout from '../components/layout';
import patrickJpg from '../../assets/patrick.jpg';

const IndexPage: FC = () => {
  return (
    <>
      {/* <NextSeo title="Patrick Miller" /> */}
      {/* <Layout> */}
        <Container className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-4">
            <div className={clsx('col-span-2', 'prose')}>
              <p>
                Hello! My name is Patrick Miller. I have been working as a
                full-stack software engineer in Osaka, Japan for several years.
              </p>
              <p>
                I work on web and hybrid mobile applications using Node,
                Angular, Ionic, Electron, React, etc. I also like to develop
                internal tools and systems to help my fellow project members
                work efficiently.
              </p>
              <p>
                I have past experience in QA, IT and mechanical engineering.
              </p>
              <p>
                Here are some various hobby projects that might be interesting.
                Feel free to contact me! Thank you.
              </p>
            </div>
            <div>
              <Image
                width={3024}
                height={3024}
                className="rounded-lg"
                src={patrickJpg}
                alt="Picture of Patrick Miller"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          </div>
        </Container>
      {/* </Layout> */}
    </>
  );
};

export default IndexPage;
