---
title: Reactivity in Swift? Part 2
date: '2023-02-22'
draft: true
---

While trying to solve the [Reactivity in Swift](./reactivity-in-swift) issue, I
could not find any existing Swift library that handled the batching issue.

I ended up using MobX as an inspiration and implementing just the batching
function in the most basic way in Swift.

Here is a JavaScript version of that:

```ts
class RxTool {
  batchCount = 0;

  batch<T = unknown>(fn: () => T): T {
    let result: T;

    this.enterBatch();

    try {
      result = fn();
    } finally {
      this.exitBatch();
    }

    return result;
  }

  private enterBatch() {
    this.batchCount += 1;
  }

  private exitBatch() {
    this.batchCount -= 1;
    if (this.batchCount === 0) {
      // flush pending reactions
      for (const [id, reaction] of this.pendingReactions) {
        reaction();
        this.pendingReactions.delete(id);
      }
    }
  }

  private pendingSideEffects = new Map<string, () => void>();

  scheduleSideEffect(id: string, fn: () => void) {
    if (this.batchCount === 0) {
      // execute immediately
      fn();
    } else {
      // add to reactions to execute later
      // if the pending reaction id already exists,
      // it will be overwritten
      this.pendingSideEffects.set(id, fn);
    }
  }
}

export const rxTool = new RxTool();
```

As this is a super minimal version, instead of `autorun` or `reaction` in MobX,
which automatically tracks changing variables and runs a side effect, I added a
function to schedule the side effect directly instead. A similar concept to
`requestAnimationFrame`, but additionally deduplicating the side effect by "id",
so only the latest version of that side effect is actually executed.

So the final code ended up looking something like this:

```ts
import { rxTool } from './reaction';

export class MyObjectToObserve {
  private _tracks: number[] = [];
  set tracks(tracks: number[]) {
    this._tracks = tracks;
    rxTool.scheduleSideEffect('set-tracks', () => {
      const next = tracks[0];
      if (typeof next === 'number') {
        console.log(`next track is ${next}`);
      } else {
        console.log('next track is empty');
      }
    });
  }
  get tracks() {
    return this._tracks;
  }

  setTracks() {
    rxTool.batch(() => {
      this.tracks = [];
      this.tracks = [...this.tracks, 1];
      this.tracks = [...this.tracks, 2];
      this.tracks = [...this.tracks, 3];
    });
  }
}
```

Except spread over many more files and more logging.

In the real app, I wrapped the suspicious functions with `batch` and the side
effect code in `scheduleSideEffect`. Amazingly enough, the UI glitch issue
disappeared almost immediately.

It was interesting to see how this batch solution could be used to resolve some
glitch issues very easily. Writing the batch code itself took some effort,
especially since I am new to Swift and have to look up syntax in the
documentation a lot. By contrast, there was very little mental overhead for
wrapping other code with the new `batch` and `scheduleSideEffect` helpers. I
also did not need to move around or restructure any existing code.

I still think the MobX `reaction` API is easier to understand. The
`scheduleSideEffect` here feels more advanced. Maybe this is why, in the
JavaScript world, we often see `reaction` type APIs together with proxy state
like MobX, but it is not common to see an API like `scheduleSideEffect`. Even
so, reducing the batch feature down to this tiny API makes it easier to port
that feature to other languages too.
