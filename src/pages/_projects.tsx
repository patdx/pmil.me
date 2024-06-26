import type { CollectionEntry } from 'astro:content';
import { type Component, For } from 'solid-js';
import { Container } from '../components/Container';
import { PostPreview } from '../components/PostPreview';

export const Projects: Component<{
  projects: CollectionEntry<'project'>[]; // really the coverImage is the GetImageResult
}> = (props) => {
  return (
    <Container class="grid gap-4 py-4">
      <section>
        <div class="container mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <PostPreview
            title="GitHub Projects"
            href="https://github.com/patdx?tab=repositories"
            excerpt="Check out my GitHub for more projects and experiments."
          />
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
