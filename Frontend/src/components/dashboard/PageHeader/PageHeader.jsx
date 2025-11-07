import React from 'react'
import { Box, Typography, Breadcrumbs, Link } from '@mui/material'
import { NavigateNext } from '@mui/icons-material'

function PageHeader({ title, subtitle, breadcrumbs }) {
	return (
		<Box
			sx={{
				mb: 4,
				pb: 2,
				borderBottom: '2px solid',
				borderColor: '#7CB9E8',
			}}
		>
			{breadcrumbs && breadcrumbs.length > 0 && (
				<Breadcrumbs
					separator={<NavigateNext fontSize="small" sx={{ color: '#B8D4E3' }} />}
					sx={{ mb: 2 }}
				>
					{breadcrumbs.map((crumb, index) =>
						index === breadcrumbs.length - 1 ? (
							<Typography
								key={index}
								sx={{
									color: '#E8F4F8',
									fontWeight: 600,
								}}
							>
								{crumb.label}
							</Typography>
						) : (
							<Link
								key={index}
								href={crumb.href}
								sx={{
									color: '#B8D4E3',
									textDecoration: 'none',
									'&:hover': {
										color: '#9DD4F0',
									},
								}}
							>
								{crumb.label}
							</Link>
						)
					)}
				</Breadcrumbs>
			)}
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				sx={{
					fontWeight: 700,
					color: '#E8F4F8',
					mb: 1,
					background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D5E2 100%)',
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
				}}
			>
				{title}
			</Typography>
			{subtitle && (
				<Typography variant="body1" sx={{ color: '#B8D4E3', fontSize: '1rem' }}>
					{subtitle}
				</Typography>
			)}
		</Box>
	)
}

export default PageHeader

