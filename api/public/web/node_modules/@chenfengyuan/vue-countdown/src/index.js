const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
const MILLISECONDS_DAY = 24 * MILLISECONDS_HOUR;
const EVENT_VISIBILITY_CHANGE = 'visibilitychange';

export default {
  name: 'countdown',

  data() {
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
      totalMilliseconds: 0,
    };
  },

  props: {
    /**
     * Starts the countdown automatically when initialized.
     */
    autoStart: {
      type: Boolean,
      default: true,
    },

    /**
     * Emits the countdown events.
     */
    emitEvents: {
      type: Boolean,
      default: true,
    },

    /**
     * The interval time (in milliseconds) of the countdown progress.
     */
    interval: {
      type: Number,
      default: 1000,
      validator: (value) => value >= 0,
    },

    /**
     * Generate the current time of a specific time zone.
     */
    now: {
      type: Function,
      default: () => Date.now(),
    },

    /**
     * The tag name of the component's root element.
     */
    tag: {
      type: String,
      default: 'span',
    },

    /**
     * The time (in milliseconds) to count down from.
     */
    time: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0,
    },

    /**
     * Transforms the output props before render.
     */
    transform: {
      type: Function,
      default: (props) => props,
    },
  },

  computed: {
    /**
     * Remaining days.
     * @returns {number} The computed value.
     */
    days() {
      return Math.floor(this.totalMilliseconds / MILLISECONDS_DAY);
    },

    /**
     * Remaining hours.
     * @returns {number} The computed value.
     */
    hours() {
      return Math.floor((this.totalMilliseconds % MILLISECONDS_DAY) / MILLISECONDS_HOUR);
    },

    /**
     * Remaining minutes.
     * @returns {number} The computed value.
     */
    minutes() {
      return Math.floor((this.totalMilliseconds % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE);
    },

    /**
     * Remaining seconds.
     * @returns {number} The computed value.
     */
    seconds() {
      return Math.floor((this.totalMilliseconds % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND);
    },

    /**
     * Remaining milliseconds.
     * @returns {number} The computed value.
     */
    milliseconds() {
      return Math.floor(this.totalMilliseconds % MILLISECONDS_SECOND);
    },

    /**
     * Total remaining days.
     * @returns {number} The computed value.
     */
    totalDays() {
      return this.days;
    },

    /**
     * Total remaining hours.
     * @returns {number} The computed value.
     */
    totalHours() {
      return Math.floor(this.totalMilliseconds / MILLISECONDS_HOUR);
    },

    /**
     * Total remaining minutes.
     * @returns {number} The computed value.
     */
    totalMinutes() {
      return Math.floor(this.totalMilliseconds / MILLISECONDS_MINUTE);
    },

    /**
     * Total remaining seconds.
     * @returns {number} The computed value.
     */
    totalSeconds() {
      return Math.floor(this.totalMilliseconds / MILLISECONDS_SECOND);
    },
  },

  render(createElement) {
    return createElement(this.tag, this.$scopedSlots.default ? [
      this.$scopedSlots.default(this.transform({
        days: this.days,
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds,
        milliseconds: this.milliseconds,
        totalDays: this.totalDays,
        totalHours: this.totalHours,
        totalMinutes: this.totalMinutes,
        totalSeconds: this.totalSeconds,
        totalMilliseconds: this.totalMilliseconds,
      })),
    ] : this.$slots.default);
  },

  watch: {
    $props: {
      deep: true,
      immediate: true,

      /**
       * Update the countdown when props changed.
       */
      handler() {
        this.totalMilliseconds = this.time;
        this.endTime = this.now() + this.time;

        if (this.autoStart) {
          this.start();
        }
      },
    },
  },

  methods: {
    /**
     * Starts to countdown.
     * @public
     * @emits Countdown#start
     */
    start() {
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
    continue() {
      if (!this.counting) {
        return;
      }

      const delay = Math.min(this.totalMilliseconds, this.interval);

      if (delay > 0) {
        if (window.requestAnimationFrame) {
          let init;
          let prev;
          const step = (now) => {
            if (!init) {
              init = now;
            }

            if (!prev) {
              prev = now;
            }

            const range = now - init;

            if (
              range >= delay

              // Avoid losing time about one second per minute (now - prev ≈ 16ms) (#43)
              || range + ((now - prev) / 2) >= delay
            ) {
              this.progress();
            } else {
              this.requestId = requestAnimationFrame(step);
            }

            prev = now;
          };

          this.requestId = requestAnimationFrame(step);
        } else {
          this.timeoutId = setTimeout(() => {
            this.progress();
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
    pause() {
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
    progress() {
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
          totalMilliseconds: this.totalMilliseconds,
        });
      }

      this.continue();
    },

    /**
     * Aborts the countdown.
     * @public
     * @emits Countdown#abort
     */
    abort() {
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
    end() {
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
    update() {
      if (this.counting) {
        this.totalMilliseconds = Math.max(0, this.endTime - this.now());
      }
    },

    /**
     * visibility change event handler.
     * @private
     */
    handleVisibilityChange() {
      switch (document.visibilityState) {
        case 'visible':
          this.update();
          this.continue();
          break;

        case 'hidden':
          this.pause();
          break;

        default:
      }
    },
  },

  mounted() {
    document.addEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
  },

  beforeDestroy() {
    document.removeEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
    this.pause();
  },
};
