import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardContent, Box, CircularProgress, Typography } from '@mui/material'
import * as d3 from 'd3'

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
		const generateMockData = () => {
			setLoading(true)
			
			// Generuj mock rozkład klas stresu
			// Realistyczny rozkład: więcej Baseline, umiarkowanie Stress, mniej Amusement i Meditation
			const classCounts = {
				Baseline: Math.floor(120 + Math.random() * 40), // 120-160
				Stress: Math.floor(45 + Math.random() * 25),    // 45-70
				Amusement: Math.floor(25 + Math.random() * 15),  // 25-40
				Meditation: Math.floor(15 + Math.random() * 15), // 15-30
			}

			// Konwertuj na format dla wykresu
			const chartDataArray = Object.entries(classCounts)
				.map(([className, count]) => ({
					name: POLISH_NAMES[className] || className,
					value: count,
					originalName: className,
				}))
				.filter(item => item.value > 0) // Tylko klasy z danymi

			setChartData(chartDataArray)
			setLoading(false)
		}

		generateMockData()
	}, [])

	useEffect(() => {
		if (loading || chartData.length === 0 || !svgRef.current) return

		// Wyczyść poprzedni wykres
		d3.select(svgRef.current).selectAll('*').remove()

		const pieWidth = 250 // Szerokość dla koła
		const legendWidth = 180 // Szerokość dla legendy
		const width = pieWidth + legendWidth + 20 // Całkowita szerokość z odstępem
		const height = 300
		const radius = Math.min(pieWidth, height) / 2 - 20

		const svg = d3
			.select(svgRef.current)
			.attr('width', width)
			.attr('height', height)

		// Koło wyśrodkowane w lewej części
		const g = svg.append('g').attr('transform', `translate(${pieWidth / 2},${height / 2})`)

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

		// Dodaj etykiety - większy arc dla lepszego wyświetlania
		const labelArc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius * 1.1)
		
		arcs
			.append('text')
			.attr('transform', d => {
				const pos = labelArc.centroid(d)
				const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
				// Jeśli segment jest po lewej stronie, przesuń tekst bardziej na zewnątrz
				if (midAngle > Math.PI) {
					pos[0] = pos[0] * 1.3
				}
				return `translate(${pos})`
			})
			.attr('text-anchor', d => {
				const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
				return midAngle > Math.PI ? 'end' : 'start'
			})
			.style('font-size', '13px')
			.style('font-weight', '600')
			.style('fill', '#333')
			.text(d => {
				const percent = ((d.data.value / d3.sum(chartData, d => d.value)) * 100).toFixed(0)
				return percent > 3 ? `${percent}%` : '' // Zmniejszono próg z 5% na 3%
			})

		// Legenda - poza wykresem po prawej stronie
		const legend = svg
			.append('g')
			.attr('transform', `translate(${pieWidth + 20}, 30)`)

		// Tytuł legendy
		legend
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('font-size', '13px')
			.style('font-weight', '600')
			.style('fill', '#333')
			.text('Klasy stresu')

		chartData.forEach((item, i) => {
			const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 22 + 20})`)

			legendRow
				.append('rect')
				.attr('width', 16)
				.attr('height', 16)
				.attr('rx', 2)
				.attr('fill', COLORS[item.originalName] || '#8884d8')
				.attr('stroke', '#fff')
				.attr('stroke-width', 1)

			const total = d3.sum(chartData, d => d.value)
			const percent = ((item.value / total) * 100).toFixed(1)

			legendRow
				.append('text')
				.attr('x', 22)
				.attr('y', 12)
				.style('font-size', '12px')
				.style('fill', '#666')
				.text(`${item.name}: ${item.value} (${percent}%)`)
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

