import { ProgressBar as AriaProgressBar, type ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import './progress-bar.css';
import '../corners.css';

// A thin bar showing how much is done (Figma: "ProgressMeter"). Built on React Aria's ProgressBar,
// which gives it role="progressbar", the value range and the spoken value.
// Figma lists a colour per Life Hub area; here a colour is any token, so each product can pass its own.
export interface ProgressBarProps extends Omit<AriaProgressBarProps, 'value' | 'minValue' | 'maxValue' | 'valueLabel' | 'children' | 'className' | 'style'> {
  /** How much is done. */
  value: number;
  /** What counts as finished. Defaults to 100. */
  max?: number;
  /** Names what is being measured. Required for screen readers. */
  label: string;
  /** Shows the label and "3 of 5" above the bar. Off by default, for places where the text sits nearby. */
  showLabel?: boolean;
  /** Fill color as a token, for example "var(--color-area-time)". Defaults to the accent. */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ProgressBar({ value, max = 100, label, showLabel = false, color, className, style, ...rest }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const valueText = max === 100 ? `${Math.round((clamped / max) * 100)}%` : `${clamped} of ${max}`;
  const classes = ['ds-progress'];
  if (className) classes.push(className);
  return (
    <AriaProgressBar
      {...rest}
      value={clamped}
      minValue={0}
      maxValue={max}
      valueLabel={valueText}
      aria-label={label}
      className={classes.join(' ')}
      style={style}
    >
      {({ percentage }) => (
        <>
          {showLabel && (
            <div className="ds-progress__text" aria-hidden="true">
              <span>{label}</span>
              <span className="ds-progress__value">{valueText}</span>
            </div>
          )}
          <div className="ds-progress__track">
            <div className="ds-progress__fill" style={{ inlineSize: `${percentage ?? 0}%`, ...(color ? { background: color } : {}) }} />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}

/** @deprecated Renamed to ProgressBar, React Aria's name. Kept so existing apps keep working. */
export const ProgressMeter = ProgressBar;
/** @deprecated Renamed to ProgressBarProps. */
export type ProgressMeterProps = ProgressBarProps;
