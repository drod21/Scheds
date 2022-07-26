import { Card as MantineCard, Image, Text, Badge, Button, Group, useMantineTheme } from '@mantine/core';

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
	const theme = useMantineTheme();
	const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

	return (
		<div style={{ width: 340, margin: 'auto' }}>
			<MantineCard shadow='sm' p='lg' onClick={onClick}>
				<MantineCard.Section>
					<Image src={image} height={160} alt='Norway' />
				</MantineCard.Section>

				<Group position='apart' style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
					<Text weight={500}>{title}</Text>
					<Badge color='pink' variant='light'>
						{badge}
					</Badge>
				</Group>
				<Text size='md'>{subtitle}</Text>

				<Text size='sm' style={{ color: secondaryColor, lineHeight: 1.5 }}>
					{children}
				</Text>

				{actions}
			</MantineCard>
		</div>
	);
}
