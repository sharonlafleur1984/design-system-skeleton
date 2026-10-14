import { Separator as AriaSeparator, type SeparatorProps as AriaSeparatorProps } from 'react-aria-components';
import './separator.css';

// A thin line between groups (Figma: "Divider"). Built on React Aria's Separator: an <hr> when
// horizontal, and role="separator" with aria-orientation when vertical.
export interface SeparatorProps extends Omit<AriaSeparatorProps, 'className'> {
  className?: string;
}

export function Separator({ orientation = 'horizontal', className, ...rest }: SeparatorProps) {
  const classes = ['ds-separator', `ds-separator--${orientation}`];
  if (className) classes.push(className);
  return <AriaSeparator orientation={orientation} className={classes.join(' ')} {...rest} />;
}

/** @deprecated Renamed to Separator, React Aria's name. Kept so existing apps keep working. */
export const Divider = Separator;
/** @deprecated Renamed to SeparatorProps. */
export type DividerProps = SeparatorProps;
