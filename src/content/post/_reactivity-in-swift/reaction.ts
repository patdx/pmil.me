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
      for (const [id, reaction] of this.pendingSideEffects) {
        reaction();
        this.pendingSideEffects.delete(id);
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
      // if the pending reaction id already exists, it will be overwritten
      this.pendingSideEffects.set(id, fn);
    }
  }
}

export const rxTool = new RxTool();
