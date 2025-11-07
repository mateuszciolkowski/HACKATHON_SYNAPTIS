import React from 'react'
import {
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Box,
	Chip,
} from '@mui/material'

function DataTable({ title, data, columns }) {
	return (
		<Card
			sx={{
				background: '#16213e',
				border: '2px solid #7CB9E8',
				borderRadius: 0,
				'&:hover': {
					boxShadow: '0 8px 30px rgba(124, 185, 232, 0.4)',
				},
			}}
		>
			<CardContent>
				{title && (
					<Typography
						variant="h6"
						sx={{
							fontWeight: 700,
							color: '#E8F4F8',
							mb: 3,
							pb: 2,
							borderBottom: '2px solid #7CB9E8',
						}}
					>
						{title}
					</Typography>
				)}
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										sx={{
											fontWeight: 600,
											color: '#B8D4E3',
											borderBottom: '2px solid #7CB9E8',
											textTransform: 'uppercase',
											fontSize: '0.75rem',
											letterSpacing: '0.5px',
										}}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row, index) => (
								<TableRow
									key={index}
									sx={{
										'&:hover': {
											backgroundColor: 'rgba(124, 185, 232, 0.1)',
										},
									}}
								>
									{columns.map((column) => (
										<TableCell
											key={column.id}
											sx={{
												color: '#E8F4F8',
												borderBottom: '1px solid rgba(124, 185, 232, 0.2)',
											}}
										>
											{column.format
												? column.format(row[column.id], row)
												: row[column.id]}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</CardContent>
		</Card>
	)
}

export default DataTable

