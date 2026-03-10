import React from 'react';
import {PropsButton} from './interfaces';
import styles from './Button.module.scss';
import Link from 'next/link';
import clsx from 'clsx';
import {useStyleClass} from '~/hooks/useStyleClass';

function Button({children, onClick, icon, href, className, target, div, ...props}: PropsButton) {
	const styleClass = useStyleClass(props, styles);
	const Wrapper: any = href ? Link : onClick || div ? 'div' : 'button';

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		if (props.disable) {
			e.preventDefault();
			return;
		}
		onClick?.(e);
	};

	return (
		<Wrapper
			className={clsx(styles.container, {
				[styles.maxContent]: props.maxContent,
				[styles.maxHeight]: props.maxHeight,
			})}
			{...(href ? {href} : {onClick: handleClick})}
		>
			<div className={clsx(styleClass, styles.btn, className)}>
				{icon && <div className={styles.icon}>{icon}</div>}
				<div className={styles.text}>{children}</div>
			</div>
		</Wrapper>
	);
}

export default Button;
