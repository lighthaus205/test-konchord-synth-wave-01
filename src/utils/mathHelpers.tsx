const eps = 0.1;
export const isZero = (angle: number) => Math.abs(angle) < eps;
export const isHalfPi = (angle: number) => Math.abs(angle - .5 * Math.PI) < eps;
export const isMinusHalfPi = (angle: number) => Math.abs(.5 * Math.PI + angle) < eps;
export const isPiOrMinusPi = (angle: number) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);

