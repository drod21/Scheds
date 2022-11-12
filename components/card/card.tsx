import Image from 'next/image';
import styles from './Card.module.scss';
interface Props {
	actions?: React.ReactNode;
	badge?: string;
	children: React.ReactNode;
	image?: string;
	onClick?: () => void;
	subtitle?: string;
	title?: string;
}

export default function Card({ actions, badge, children, image, onClick, subtitle, title }: Props) {
	return (
		<div className={onClick ? styles.cardClickable : ''} style={{ width: 340, margin: 'auto' }}>
			<div onClick={onClick}>
				<section>
					<Image src={image} height={160} alt='Norway' />
				</section>

				<div style={{ marginBottom: 5 }}>
					<h5>{title}</h5>
					<div>{badge}</div>
				</div>
				<p>{subtitle}</p>

				<p style={{ lineHeight: 1.5 }}>{children}</p>

				{actions}
			</div>
		</div>
	);
}
