// Source: Resources/GrowwLogo.svg — geometry preserved verbatim. ViewBox is
// padded so round line caps don't clip on the edges of the bounding box.
export const RAW_VIEWBOX_SIZE = 33;
const PAD = 4;
export const PADDING = PAD;
export const VIEWBOX_SIZE = RAW_VIEWBOX_SIZE + PAD * 2; // 41
export const VIEWBOX = `${-PAD} ${-PAD} ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`;

// Outer circle
export const CIRCLE_CX = 16.4736;
export const CIRCLE_CY = 16.4736;
export const CIRCLE_R = 16.2736;
export const CIRCLE_LEN = 2 * Math.PI * CIRCLE_R; // ≈ 102.24

// Convenience object kept for backward compatibility with explorations
export const CIRCLE = { cx: CIRCLE_CX, cy: CIRCLE_CY, r: CIRCLE_R };
export const CIRCLE_CIRCUMFERENCE = CIRCLE_LEN;

// Stock-line path
export const LINE_D =
  'M2.15041 24.0476L11.8627 16.4952C12.4463 16.0414 13.2387 15.9635 13.8996 16.2949L18.3554 18.5295C19.0634 18.8845 19.9168 18.7678 20.5034 18.2357L30.7969 8.8999';

export const LINE_LEN = 46;
export const LINE_LENGTH = LINE_LEN;
export const STROKE_WIDTH = 0.6;

// Closed region that traces the stock-line then closes down to the bottom of
// the bounding box and back up to the line's start. When clipped to the outer
// circle this produces a "chart area below the line" shape.
export const AREA_D =
  'M2.15041 24.0476L11.8627 16.4952C12.4463 16.0414 13.2387 15.9635 13.8996 16.2949L18.3554 18.5295C19.0634 18.8845 19.9168 18.7678 20.5034 18.2357L30.7969 8.8999 L33 8.8999 L33 33 L0 33 L0 24.0476 Z';
