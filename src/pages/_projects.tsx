import type { CollectionEntry } from 'astro:content';
import { Component, For } from 'solid-js';
import { Container } from '../components/Container';
import { PostPreview } from '../components/PostPreview';

export const Projects: Component<{
  projects: CollectionEntry<'project'>[];
}> = (props) => {
  return (
    <Container class="grid gap-4 py-4">
      <section>
        <div class="container mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <For each={props.projects}>
            {(project) => (
              <PostPreview
                {...project.data}
                href={`/projects/${project.slug}`}
              />
            )}
          </For>
        </div>
      </section>
    </Container>
  );
};
