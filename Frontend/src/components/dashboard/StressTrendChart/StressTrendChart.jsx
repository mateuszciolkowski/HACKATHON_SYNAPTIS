import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardContent, Box, CircularProgress, Typography } from '@mui/material'
import * as d3 from 'd3'
import axios from 'axios'

// Configure axios instance
const axiosInstance = axios.create({
	baseURL: import.meta.env.DEV ? '' : '',
	headers: {
		'Content-Type': 'application/json',
	},
})

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
	config => {
		const tokens = localStorage.getItem('authTokens')
		if (tokens) {
			try {
				const parsedTokens = JSON.parse(tokens)
				if (parsedTokens?.access) {
					config.headers.Authorization = `Bearer ${parsedTokens.access}`
				}
			} catch (error) {
				console.error('Error parsing tokens:', error)
			}
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

function StressTrendChart() {
	const svgRef = useRef(null)
	const [chartData, setChartData] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				
				// Pobierz wizyty
				const visitsResponse = await axiosInstance.get('/api/visits/')
				const visits = visitsResponse.data.results || visitsResponse.data || []

				// Grupuj wizyty według tygodni
				const weeklyData = {}
				
				visits.forEach(visit => {
					if (visit.stress_history && visit.stress_history.summary) {
						const visitDate = new Date(visit.visit_date)
						const weekStart = new Date(visitDate)
						weekStart.setDate(visitDate.getDate() - visitDate.getDay()) // Początek tygodnia (niedziela)
						weekStart.setHours(0, 0, 0, 0)
						
						const weekKey = weekStart.toISOString().split('T')[0]
						
						if (!weeklyData[weekKey]) {
							weeklyData[weekKey] = {
								date: weekKey,
								stressLevel: 0,
								count: 0,
							}
						}
						
						const stressPercentage = visit.stress_history.summary.stress_percentage || 0
						weeklyData[weekKey].stressLevel += stressPercentage
						weeklyData[weekKey].count += 1
					}
				})

				// Oblicz średnie i posortuj
				const chartDataArray = Object.values(weeklyData)
					.map(week => ({
						date: new Date(week.date),
						dateLabel: new Date(week.date).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
						stressLevel: week.count > 0 ? parseFloat((week.stressLevel / week.count).toFixed(1)) : 0,
					}))
					.sort((a, b) => a.date - b.date)
					.slice(-8) // Ostatnie 8 tygodni

				setChartData(chartDataArray)
			} catch (error) {
				console.error('Error fetching chart data:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	useEffect(() => {
		if (loading || chartData.length === 0 || !svgRef.current) return

		// Wyczyść poprzedni wykres
		d3.select(svgRef.current).selectAll('*').remove()

		const margin = { top: 20, right: 30, bottom: 40, left: 50 }
		const width = 600 - margin.left - margin.right
		const height = 300 - margin.top - margin.bottom

		const svg = d3
			.select(svgRef.current)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)

		const g = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`)

		// Skale
		const xScale = d3
			.scaleTime()
			.domain(d3.extent(chartData, d => d.date))
			.range([0, width])

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(chartData, d => d.stressLevel) || 100])
			.nice()
			.range([height, 0])

		// Linia
		const line = d3
			.line()
			.x(d => xScale(d.date))
			.y(d => yScale(d.stressLevel))
			.curve(d3.curveMonotoneX)

		// Rysuj linię
		g.append('path')
			.datum(chartData)
			.attr('fill', 'none')
			.attr('stroke', '#4A90E2')
			.attr('stroke-width', 2)
			.attr('d', line)

		// Punkty
		g.selectAll('.dot')
			.data(chartData)
			.enter()
			.append('circle')
			.attr('class', 'dot')
			.attr('cx', d => xScale(d.date))
			.attr('cy', d => yScale(d.stressLevel))
			.attr('r', 4)
			.attr('fill', '#4A90E2')

		// Osie
		const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%d %b'))
		const yAxis = d3.axisLeft(yScale)

		g.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)
			.selectAll('text')
			.style('text-anchor', 'end')
			.attr('dx', '-.8em')
			.attr('dy', '.15em')
			.attr('transform', 'rotate(-45)')

		g.append('g').call(yAxis)

		// Etykiety osi
		g.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0 - margin.left)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('Poziom stresu (%)')

		// Tooltip
		const tooltip = d3.select('body').append('div').style('opacity', 0).style('position', 'absolute')

		g.selectAll('.dot')
			.on('mouseover', function (event, d) {
				tooltip.transition().duration(200).style('opacity', 0.9)
				tooltip
					.html(`${d.dateLabel}<br/>${d.stressLevel}%`)
					.style('left', event.pageX + 10 + 'px')
					.style('top', event.pageY - 28 + 'px')
					.style('background', 'rgba(0, 0, 0, 0.8)')
					.style('color', 'white')
					.style('padding', '8px')
					.style('border-radius', '4px')
					.style('font-size', '12px')
			})
			.on('mouseout', function () {
				tooltip.transition().duration(200).style('opacity', 0)
			})
	}, [chartData, loading])

	return (
		<Card>
			<CardHeader title="Trend poziomu stresu w czasie" />
			<CardContent>
				{loading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
						<CircularProgress />
					</Box>
				) : chartData.length === 0 ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
						<Typography color="text.secondary">Brak danych do wyświetlenia</Typography>
					</Box>
				) : (
					<Box sx={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
						<svg ref={svgRef}></svg>
					</Box>
				)}
			</CardContent>
		</Card>
	)
}

export default StressTrendChart

