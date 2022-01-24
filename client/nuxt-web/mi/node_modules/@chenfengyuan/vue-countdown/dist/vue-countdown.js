/*!
 * vue-countdown v1.1.5
 * https://fengyuanchen.github.io/vue-countdown
 *
 * Copyright 2018-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2020-02-25T01:19:32.769Z
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.VueCountdown = factory());
}(this, (function () { 'use strict';

  var MILLISECONDS_SECOND = 1000;
  var MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
  var MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
  var MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR;
  var EVENT_VISIBILITY_CHANGE = 'visibilitychange';
  var index = {
    name: 'countdown',
    data: function data() {
      return {
        /**
         * It is counting down.
         * @type {boolean}
         */
        counting: false,

        /**
         * The absolute end time.
         * @type {number}
         */
        endTime: 0,

        /**
         * The remaining milliseconds.
         * @type {number}
         */
        totalMilliseconds: 0
      };
    },
    props: {
      /**
       * Starts the countdown automatically when initialized.
       */
      autoStart: {
        type: Boolean,
        default: true
      },

      /**
       * Emits the countdown events.
       */
      emitEvents: {
        type: Boolean,
        default: true
      },

      /**
       * The interval time (in milliseconds) of the countdown progress.
       */
      interval: {
        type: Number,
        default: 1000,
        validator: function validator(value) {
          return value >= 0;
        }
      },

      /**
       * Generate the current time of a specific time zone.
       */
      now: {
        type: Function,
        default: function _default() {
          return Date.now();
        }
      },

      /**
       * The tag name of the component's root element.
       */
      tag: {
        type: String,
        default: 'span'
      },

      /**
       * The time (in milliseconds) to count down from.
       */
      time: {
        type: Number,
        default: 0,
        validator: function validator(value) {
          return value >= 0;
        }
      },

      /**
       * Transforms the output props before render.
       */
      transform: {
        type: Function,
        default: function _default(props) {
          return props;
        }
      }
    },
    computed: {
      /**
       * Remaining days.
       * @returns {number} The computed value.
       */
      days: function days() {
        return Math.floor(this.totalMilliseconds / MILLISECONDS_DAY);
      },

      /**
       * Remaining hours.
       * @returns {number} The computed value.
       */
      hours: function hours() {
        return Math.floor(this.totalMilliseconds % MILLISECONDS_DAY / MILLISECONDS_HOUR);
      },

      /**
       * Remaining minutes.
       * @returns {number} The computed value.
       */
      minutes: function minutes() {
        return Math.floor(this.totalMilliseconds % MILLISECONDS_HOUR / MILLISECONDS_MINUTE);
      },

      /**
       * Remaining seconds.
       * @returns {number} The computed value.
       */
      seconds: function seconds() {
        return Math.floor(this.totalMilliseconds % MILLISECONDS_MINUTE / MILLISECONDS_SECOND);
      },

      /**
       * Remaining milliseconds.
       * @returns {number} The computed value.
       */
      milliseconds: function milliseconds() {
        return Math.floor(this.totalMilliseconds % MILLISECONDS_SECOND);
      },

      /**
       * Total remaining days.
       * @returns {number} The computed value.
       */
      totalDays: function totalDays() {
        return this.days;
      },

      /**
       * Total remaining hours.
       * @returns {number} The computed value.
       */
      totalHours: function totalHours() {
        return Math.floor(this.totalMilliseconds / MILLISECONDS_HOUR);
      },

      /**
       * Total remaining minutes.
       * @returns {number} The computed value.
       */
      totalMinutes: function totalMinutes() {
        return Math.floor(this.totalMilliseconds / MILLISECONDS_MINUTE);
      },

      /**
       * Total remaining seconds.
       * @returns {number} The computed value.
       */
      totalSeconds: function totalSeconds() {
        return Math.floor(this.totalMilliseconds / MILLISECONDS_SECOND);
      }
    },
    render: function render(createElement) {
      return createElement(this.tag, this.$scopedSlots.default ? [this.$scopedSlots.default(this.transform({
        days: this.days,
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds,
        milliseconds: this.milliseconds,
        totalDays: this.totalDays,
        totalHours: this.totalHours,
        totalMinutes: this.totalMinutes,
        totalSeconds: this.totalSeconds,
        totalMilliseconds: this.totalMilliseconds
      }))] : this.$slots.default);
    },
    watch: {
      $props: {
        deep: true,
        immediate: true,

        /**
         * Update the countdown when props changed.
         */
        handler: function handler() {
          this.totalMilliseconds = this.time;
          this.endTime = this.now() + this.time;

          if (this.autoStart) {
            this.start();
          }
        }
      }
    },
    methods: {
      /**
       * Starts to countdown.
       * @public
       * @emits Countdown#start
       */
      start: function start() {
        if (this.counting) {
          return;
        }

        this.counting = true;

        if (this.emitEvents) {
          /**
           * Countdown start event.
           * @event Countdown#start
           */
          this.$emit('start');
        }

        if (document.visibilityState === 'visible') {
          this.continue();
        }
      },

      /**
       * Continues the countdown.
       * @private
       */
      continue: function _continue() {
        var _this = this;

        if (!this.counting) {
          return;
        }

        var delay = Math.min(this.totalMilliseconds, this.interval);

        if (delay > 0) {
          if (window.requestAnimationFrame) {
            var init;
            var prev;

            var step = function step(now) {
              if (!init) {
                init = now;
              }

              if (!prev) {
                prev = now;
              }

              var range = now - init;

              if (range >= delay // Avoid losing time about one second per minute (now - prev ≈ 16ms) (#43)
              || range + (now - prev) / 2 >= delay) {
                _this.progress();
              } else {
                _this.requestId = requestAnimationFrame(step);
              }

              prev = now;
            };

            this.requestId = requestAnimationFrame(step);
          } else {
            this.timeoutId = setTimeout(function () {
              _this.progress();
            }, delay);
          }
        } else {
          this.end();
        }
      },

      /**
       * Pauses the countdown.
       * @private
       */
      pause: function pause() {
        if (window.requestAnimationFrame) {
          cancelAnimationFrame(this.requestId);
        } else {
          clearTimeout(this.timeoutId);
        }
      },

      /**
       * Progresses to countdown.
       * @private
       * @emits Countdown#progress
       */
      progress: function progress() {
        if (!this.counting) {
          return;
        }

        this.totalMilliseconds -= this.interval;

        if (this.emitEvents && this.totalMilliseconds > 0) {
          /**
           * Countdown progress event.
           * @event Countdown#progress
           */
          this.$emit('progress', {
            days: this.days,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            milliseconds: this.milliseconds,
            totalDays: this.totalDays,
            totalHours: this.totalHours,
            totalMinutes: this.totalMinutes,
            totalSeconds: this.totalSeconds,
            totalMilliseconds: this.totalMilliseconds
          });
        }

        this.continue();
      },

      /**
       * Aborts the countdown.
       * @public
       * @emits Countdown#abort
       */
      abort: function abort() {
        if (!this.counting) {
          return;
        }

        this.pause();
        this.counting = false;

        if (this.emitEvents) {
          /**
           * Countdown abort event.
           * @event Countdown#abort
           */
          this.$emit('abort');
        }
      },

      /**
       * Ends the countdown.
       * @public
       * @emits Countdown#end
       */
      end: function end() {
        if (!this.counting) {
          return;
        }

        this.pause();
        this.totalMilliseconds = 0;
        this.counting = false;

        if (this.emitEvents) {
          /**
           * Countdown end event.
           * @event Countdown#end
           */
          this.$emit('end');
        }
      },

      /**
       * Updates the count.
       * @private
       */
      update: function update() {
        if (this.counting) {
          this.totalMilliseconds = Math.max(0, this.endTime - this.now());
        }
      },

      /**
       * visibility change event handler.
       * @private
       */
      handleVisibilityChange: function handleVisibilityChange() {
        switch (document.visibilityState) {
          case 'visible':
            this.update();
            this.continue();
            break;

          case 'hidden':
            this.pause();
            break;
        }
      }
    },
    mounted: function mounted() {
      document.addEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
    },
    beforeDestroy: function beforeDestroy() {
      document.removeEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
      this.pause();
    }
  };

  return index;

})));
