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
