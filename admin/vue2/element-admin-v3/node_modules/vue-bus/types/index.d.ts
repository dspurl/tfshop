import Vue from 'vue';
import './vue';

export function install(vue: typeof Vue): void;

export declare interface VueBus {
  /**
   * Listen for a custom event. The callback will receive all the additional arguments passed into these event-triggering methods.
   */
  on(event: string | string[], callback: (...args: any[]) => void): this;

  /**
   * Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.
   */
  once(event: string, callback: (...args: any[]) => void): this;

  /**
   * Remove custom event listener(s).
   * If no arguments are provided, remove all event listeners;
   * If only the event is provided, remove all listeners for that event;
   * If both event and callback are given, remove the listener for that specific callback only.
   */
  off(event?: string | string[], callback?: (...args: any[]) => void): this;

  /**
   * Trigger an event on the current instance. Any additional arguments will be passed into the listener’s callback function.
   */
  emit(event: string, ...args: any[]): this;
}
