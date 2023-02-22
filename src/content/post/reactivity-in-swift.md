---
title: Reactivity in Swift?
date: '2023-02-18'
---

I mostly work with JavaScript, but I've become in charge of some Swift code
recently.

I also realized today that Swift has some built in mechanisms for observing
changing properties. That is pretty cool, kind of like the Swift equivalent of
MobX or SolidJS?

```swift
class MyObjectToObserve: NSObject {
  var observation: NSKeyValueObservation?

  @objc dynamic var tracks: [Int] = []

  override init() {
    super.init()
    observation = observe(
      \.tracks,
      options: .new
    ) { [self] _, _ in
      let next = tracks.first
      switch next {
      case .none:
        print("next track is empty")
      case let .some(next):
        print("next track is \(next)")
      }
    }
  }

  func setTracks() {
    tracks.removeAll()
    tracks.append(1)
    tracks.append(2)
    tracks.append(3)
  }
}
```

Basically it observes a list of (media) tracks, and emits some update events
when the next track changes.

However, I am running into a bug because the Swift implementation emits a change
event for _every_ intermediate step. Is there a good way to perform multiple
modifications, similar to a `batch` (SolidJS) or `action` (MobX)?

Here is what happens when I call `setTracks()`:

```sh
> swift run
next track is empty
next track is 1
next track is 1
next track is 1
```

### SolidJS

Here is the same thing in Solid:

```js
import { batch, createEffect, createSignal, on } from 'solid-js';

const [tracks, setTracks] = createSignal([]);

class MyObjectToObserve {
  constructor() {
    createEffect(
      on(
        tracks,
        (tracks) => {
          const next = tracks[0];

          if (typeof next === 'number') {
            console.log(`next track is ${next}`);
          } else {
            console.log('next track is empty');
          }
        },
        {
          defer: true,
        }
      )
    );
  }

  setTracks() {
    batch(() => {
      setTracks([]);
      setTracks((tracks) => [...tracks, 1]);
      setTracks((tracks) => [...tracks, 2]);
      setTracks((tracks) => [...tracks, 3]);
    });
  }
}
```

The output of the SolidJS program is:

```sh
> node --conditions=browser solid.mjs
next track is 1
```

### MobX

Or in MobX:

```js
import { action, makeObservable, reaction } from 'mobx';

class MyObjectToObserve {
  tracks = [];

  constructor() {
    makeObservable(this, {
      tracks: true,
      setTracks: action,
    });

    reaction(
      () => this.tracks,
      (tracks) => {
        const next = tracks[0];
        if (typeof next === 'number') {
          console.log(`next track is ${next}`);
        } else {
          console.log('next track is empty');
        }
      }
    );
  }

  setTracks() {
    this.tracks = [];
    this.tracks = [...this.tracks, 1];
    this.tracks = [...this.tracks, 2];
    this.tracks = [...this.tracks, 3];
  }
}
```

```
> node mobx.mjs
next track is 1
```
