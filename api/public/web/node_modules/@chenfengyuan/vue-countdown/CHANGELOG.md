# Changelog

## 1.1.5 (Feb 25, 2020)

- Drop an useless dependency (#45).

## 1.1.4 (Dec 21, 2019)

- Fix an issue of losing time about one second per minute (#43).

## 1.1.3 (Sep 14, 2019)

- Continue counting down only when the current tab is visible (#37).

## 1.1.2 (Apr 16, 2019)

- Add missing properties for the `progress` event (#34).

## 1.1.1 (Apr 5, 2019)

- Use `requestAnimationFrame` instead of `setTimeout` for better performance (#33).

## 1.1.0 (Dec 23, 2018)

- Add new `now` option for customizing local time.
- Pause the countdown when the page is hidden and continue the countdown when the page is visible again.

## 1.0.1 (Nov 9, 2018)

- Fix the issue of props updating (#1).

## 1.0.0 (Oct 21, 2018)

- Supports 6 props (options): `autoStart`, `emitEvents`, `interval`, `tag`, `time` and `transform`.
- Supports 3 methods: `start`, `abort` and `end`.
- Supports 4 events: `start`, `progress`, `abort` and `end`.
- Supports 10 scope properties: `days`, `hours`, `minutes`, `seconds`, `milliseconds`, `totalDays`, `totalHours`, `totalMinutes`, `totalSeconds` and `totalMilliseconds`.
