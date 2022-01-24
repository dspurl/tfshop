import { head, indexOf, size, last } from '@antv/util';
import { precisionAdd } from './math';

export const DEFAULT_Q = [1, 5, 2, 2.5, 4, 3];

export const ALL_Q = [1, 5, 2, 2.5, 4, 3, 1.5, 7, 6, 8, 9];

const eps = Number.EPSILON * 100;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function simplicity(q: number, Q: number[], j: number, lmin: number, lmax: number, lstep: number) {
  const n = size(Q);
  const i = indexOf(Q, q);
  let v = 0;
  const m = mod(lmin, lstep);
  if ((m < eps || lstep - m < eps) && lmin <= 0 && lmax >= 0) {
    v = 1;
  }
  return 1 - i / (n - 1) - j + v;
}

function simplicityMax(q: number, Q: number[], j: number) {
  const n = size(Q);
  const i = indexOf(Q, q);
  const v = 1;
  return 1 - i / (n - 1) - j + v;
}

function density(k: number, m: number, dMin: number, dMax: number, lMin: number, lMax: number) {
  const r = (k - 1) / (lMax - lMin);
  const rt = (m - 1) / (Math.max(lMax, dMax) - Math.min(dMin, lMin));
  return 2 - Math.max(r / rt, rt / r);
}

function densityMax(k: number, m: number) {
  if (k >= m) {
    return 2 - (k - 1) / (m - 1);
  }
  return 1;
}

function coverage(dMin: number, dMax: number, lMin: number, lMax: number) {
  const range = dMax - dMin;
  return 1 - (0.5 * ((dMax - lMax) ** 2 + (dMin - lMin) ** 2)) / (0.1 * range) ** 2;
}

function coverageMax(dMin: number, dMax: number, span: number) {
  const range = dMax - dMin;
  if (span > range) {
    const half = (span - range) / 2;
    return 1 - half ** 2 / (0.1 * range) ** 2;
  }
  return 1;
}

function legibility() {
  return 1;
}

/**
 * An Extension of Wilkinson's Algorithm for Position Tick Labels on Axes
 * https://www.yuque.com/preview/yuque/0/2019/pdf/185317/1546999150858-45c3b9c2-4e86-4223-bf1a-8a732e8195ed.pdf
 * @param dMin 最小值
 * @param dMax 最大值
 * @param m tick个数
 * @param onlyLoose 是否允许扩展min、max，不绝对强制，例如[3, 97]
 * @param Q nice numbers集合
 * @param w 四个优化组件的权重
 */
export default function extended(
  dMin: number,
  dMax: number,
  m: number = 5,
  onlyLoose: boolean = true,
  Q: number[] = DEFAULT_Q,
  w: [number, number, number, number] = [0.25, 0.2, 0.5, 0.05],
): { min: number; max: number; ticks: number[] } {
  // nan 也会导致异常
  if (Number.isNaN(dMin) || Number.isNaN(dMax) || typeof dMin !== 'number' || typeof dMax !== 'number' || !m) {
    return {
      min: 0,
      max: 0,
      ticks: [],
    };
  }

  // js 极大值极小值问题，差值小于 1e-15 会导致计算出错
  if (dMax - dMin < 1e-15 || m === 1) {
    return {
      min: dMin,
      max: dMax,
      ticks: [dMin],
    };
  }

  const best = {
    score: -2,
    lmin: 0,
    lmax: 0,
    lstep: 0,
  };

  let j = 1;
  while (j < Infinity) {
    for (let i = 0; i < Q.length; i += 1) {
      const q = Q[i];
      const sm = simplicityMax(q, Q, j);
      if (w[0] * sm + w[1] + w[2] + w[3] < best.score) {
        j = Infinity;
        break;
      }
      let k = 2;
      while (k < Infinity) {
        const dm = densityMax(k, m);
        if (w[0] * sm + w[1] + w[2] * dm + w[3] < best.score) {
          break;
        }

        const delta = (dMax - dMin) / (k + 1) / j / q;
        let z = Math.ceil(Math.log10(delta));

        while (z < Infinity) {
          const step = j * q * 10 ** z;
          const cm = coverageMax(dMin, dMax, step * (k - 1));

          if (w[0] * sm + w[1] * cm + w[2] * dm + w[3] < best.score) {
            break;
          }

          const minStart = Math.floor(dMax / step) * j - (k - 1) * j;
          const maxStart = Math.ceil(dMin / step) * j;

          if (minStart > maxStart) {
            z += 1;
            // eslint-disable-next-line no-continue
            continue;
          }
          for (let start = minStart; start <= maxStart; start += 1) {
            const lMin = start * (step / j);
            const lMax = lMin + step * (k - 1);
            const lStep = step;

            const s = simplicity(q, Q, j, lMin, lMax, lStep);
            const c = coverage(dMin, dMax, lMin, lMax);
            const g = density(k, m, dMin, dMax, lMin, lMax);
            const l = legibility();

            const score = w[0] * s + w[1] * c + w[2] * g + w[3] * l;
            if (score > best.score && (!onlyLoose || (lMin <= dMin && lMax >= dMax))) {
              best.lmin = lMin;
              best.lmax = lMax;
              best.lstep = lStep;
              best.score = score;
            }
          }
          z += 1;
        }
        k += 1;
      }
    }
    j += 1;
  }

  let i = 0;

  // 步长为浮点数时处理精度
  const range = new Array(Math.floor((best.lmax - best.lmin) / best.lstep));

  for (let tick = best.lmin; tick <= best.lmax; tick = precisionAdd(tick, best.lstep)) {
    range[i] = tick;
    i += 1;
  }
  return {
    min: Math.min(dMin, head(range)),
    max: Math.max(dMax, last(range)),
    ticks: range,
  };
};
