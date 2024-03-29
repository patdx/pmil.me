import type { Component } from 'solid-js';
import { HeaderLink } from './HeaderLink';

export const NavHeader: Component = () => {
  return (
    <div class="grid grid-cols-4 divide-x divide-blue-100 p-4 text-center sm:mx-auto sm:w-[36rem]">
      {LINKS.map((link) => (
        <div class="px-2">
          <HeaderLink href={link.url}>{link.title}</HeaderLink>
        </div>
      ))}
    </div>
  );
};

const LINKS = [
  {
    title: 'About',
    url: '/',
  },
  {
    title: 'Blog',
    url: '/posts',
  },
  {
    title: 'Projects',
    url: '/projects',
  },
  {
    title: 'Contact',
    url: '/contact',
  },
];
