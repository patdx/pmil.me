---
title: Streaming Dynamic HTML with Hono
date: '2024-06-01'
tags: ['hono', 'html', 'streaming']
---

Hono is a a web app framework for the latest generation of JavaScript and its
new frameworks and runtimes. It's really great and I like it a lot.

One of its really interesting features is that it supports streaming JSX to the
browser, very _similar_ to Next.js with React Server Components, but it does it
with inline scripts, not needing a full-scale framework in the browser.

You can even use Suspense and so on, allowing you to create, for example, an app
shell with async logic inside:

```tsx
<>
  <Header />
  <Suspense fallback={<Loading />}>
    <LoadAsyncData />
  </Suspense>
</>
```

But while I was experimenting with a recent project, I wanted to try streaming
my results to the browser. Unfortunately, the data is not just append-only, so I
wondered if there was a way to get Hono to replace the data.

After some experimentation, and a lot of complicated attempts, I found a way to
do it that turned out to be relatively simple. See the AsyncList component below
for the solution:

```tsx
async function AsyncList({
  generator,
}: {
  generator: AsyncGenerator<any, any, any>;
}) {
  const value = await generator.next();

  if (value.done) {
    return value.value;
  }

  return (
    <Suspense fallback={value.value}>
      <AsyncList generator={generator} />
    </Suspense>
  );
}

const timer = (ms: number) =>
  new Promise<string>((resolve) => setTimeout(() => resolve('hello!'), ms));

app.get('/test', (c) => {
  return c.render(
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncList
        generator={(async function* () {
          yield <div>hello</div>;
          await timer(1000);
          yield <div>world</div>;
          await timer(1000);
          return <div>goodbye</div>;
        })()}
      />
    </Suspense>
  );
});
```
