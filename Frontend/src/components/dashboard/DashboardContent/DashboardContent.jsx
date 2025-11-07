import React from 'react'
import { Container, Grid } from '@mui/material'
import PageHeader from '../PageHeader'
import DashboardStats from '../DashboardStats'
import UserInfoCard from '../UserInfoCard'
import QuickActionsCard from '../QuickActionsCard'

function DashboardContent() {
	return (
		<Container maxWidth="xl">
			<PageHeader
				title="Dashboard"
				subtitle="Przeglądaj statystyki i zarządzaj swoim kontem"
				breadcrumbs={[
					{ label: 'Dashboard', href: '#' },
				]}
			/>

			<DashboardStats />

			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<UserInfoCard />
				</Grid>
				<Grid item xs={12} md={4}>
					<QuickActionsCard />
				</Grid>
			</Grid>
		</Container>
	)
}

export default DashboardContent

