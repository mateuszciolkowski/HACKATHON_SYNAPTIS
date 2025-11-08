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

const COLORS = {
	Baseline: '#4A90E2',
	Stress: '#E24A4A',
	Amusement: '#4AE2A0',
	Meditation: '#9B4AE2',
}

const POLISH_NAMES = {
	Baseline: 'Bazowy',
	Stress: 'Stres',
	Amusement: 'Rozrywka',
	Meditation: 'Medytacja',
}

function StressClassDistribution() {
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

				// Zlicz klasy stresu ze wszystkich wizyt
				const classCounts = {
					Baseline: 0,
					Stress: 0,
					Amusement: 0,
					Meditation: 0,
				}

				visits.forEach(visit => {
					if (visit.stress_history && visit.stress_history.statistics) {
						const classDistribution = visit.stress_history.statistics.class_distribution || []
						
						classDistribution.forEach(item => {
							if (classCounts.hasOwnProperty(item.class_name)) {
								classCounts[item.class_name] += item.count || 0
							}
						})
					}
				})

				// Konwertuj na format dla wykresu
				const chartDataArray = Object.entries(classCounts)
					.map(([className, count]) => ({
						name: POLISH_NAMES[className] || className,
						value: count,
						originalName: className,
					}))
					.filter(item => item.value > 0) // Tylko klasy z danymi

				setChartData(chartDataArray)
			} catch (error) {
				console.error('Error fetching distribution data:', error)
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

		const width = 300
		const height = 300
		const radius = Math.min(width, height) / 2 - 10

		const svg = d3
			.select(svgRef.current)
			.attr('width', width)
			.attr('height', height)

		const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

		// Utwórz pie chart
		const pie = d3.pie().value(d => d.value)

		// Utwórz arc generator
		const arc = d3.arc().innerRadius(0).outerRadius(radius)

		// Rysuj segmenty
		const arcs = g.selectAll('.arc').data(pie(chartData)).enter().append('g').attr('class', 'arc')

		arcs
			.append('path')
			.attr('d', arc)
			.attr('fill', d => COLORS[d.data.originalName] || '#8884d8')
			.attr('stroke', '#fff')
			.attr('stroke-width', 2)

		// Dodaj etykiety
		arcs
			.append('text')
			.attr('transform', d => `translate(${arc.centroid(d)})`)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.style('font-weight', 'bold')
			.text(d => {
				const percent = ((d.data.value / d3.sum(chartData, d => d.value)) * 100).toFixed(0)
				return percent > 5 ? `${percent}%` : ''
			})

		// Legenda
		const legend = svg
			.append('g')
			.attr('transform', `translate(${width - 100}, 20)`)

		chartData.forEach((item, i) => {
			const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`)

			legendRow
				.append('rect')
				.attr('width', 15)
				.attr('height', 15)
				.attr('fill', COLORS[item.originalName] || '#8884d8')

			legendRow
				.append('text')
				.attr('x', 20)
				.attr('y', 12)
				.style('font-size', '12px')
				.text(`${item.name} (${item.value})`)
		})

		// Tooltip
		const tooltip = d3.select('body').append('div').style('opacity', 0).style('position', 'absolute')

		arcs
			.selectAll('path')
			.on('mouseover', function (event, d) {
				tooltip.transition().duration(200).style('opacity', 0.9)
				tooltip
					.html(`${d.data.name}<br/>Liczba: ${d.data.value}<br/>${((d.data.value / d3.sum(chartData, d => d.value)) * 100).toFixed(1)}%`)
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
			<CardHeader title="Rozkład klas stresu" />
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

export default StressClassDistribution

