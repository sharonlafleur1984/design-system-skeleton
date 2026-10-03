import type { HTMLAttributes } from 'react';
import './progress-meter.css';

// Mirrors the Figma "ProgressMeter" set. Figma lists a colour per Life Hub area;
// here a colour is any token name, so each product can pass its own.
export interface ProgressMeterProps extends HTMLAttributes<HTMLDivElement> {
  /** How much is done. */
  value: number;
  /** What counts as finished. Defaults to 100. */
  max?: number;
  /** Names what is being measured, for example "Senior year checklist". Required for screen readers. */
  label: string;
  /** Shows the label and "3 of 5" above the bar. Off by default, for places where the text sits nearby. */
  showLabel?: boolean;
  /** Fill color as a CSS color or token, for example "var(--color-area-time)". Defaults to the accent. */
  color?: string;
}

export function ProgressMeter({
  value,
  max = 100,
  label,
  showLabel = false,
  color,
  className,
  style,
  ...rest
}: ProgressMeterProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? (clamped / max) * 100 : 0;
  const valueText = max === 100 ? `${Math.round(percent)}%` : `${clamped} of ${max}`;
  const classes = ['ds-progress'];
  if (className) classes.push(className);
  return (
    <div className={classes.join(' ')} style={style} {...rest}>
      {showLabel && (
        <div className="ds-progress__text" aria-hidden="true">
          <span>{label}</span>
          <span className="ds-progress__value">{valueText}</span>
        </div>
      )}
      <div
        className="ds-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={valueText}
      >
        <div
          className="ds-progress__fill"
          style={{ inlineSize: `${percent}%`, ...(color ? { background: color } : {}) }}
        />
      </div>
    </div>
  );
}
