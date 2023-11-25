export class Timer {
  private timeoutId: ReturnType<typeof setTimeout> | undefined;
  static timeframe: number = 1 * 60 * 1000;

  debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>): void => {
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
}
