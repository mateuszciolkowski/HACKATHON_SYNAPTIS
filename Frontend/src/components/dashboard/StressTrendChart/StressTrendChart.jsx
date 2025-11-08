import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardContent, Box, CircularProgress, Typography } from '@mui/material'
import * as d3 from 'd3'

function StressTrendChart() {
	const svgRef = useRef(null)
	const [chartData, setChartData] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const generateMockData = () => {
			setLoading(true)
			
			// Generuj mock dane dla ostatnich 8 tygodni
			const chartDataArray = []
			const today = new Date()
			
			for (let i = 7; i >= 0; i--) {
				const weekStart = new Date(today)
				weekStart.setDate(today.getDate() - (i * 7))
				weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Początek tygodnia (niedziela)
				weekStart.setHours(0, 0, 0, 0)
				
				// Generuj realistyczny poziom stresu z trendem (lekki spadek w czasie)
				// Bazowy poziom: 45-65%, z lekkim trendem spadkowym
				const baseStress = 55 - (i * 1.5) // Trend spadkowy
				const variation = (Math.random() - 0.5) * 15 // Wariacja ±7.5%
				const stressLevel = Math.max(20, Math.min(80, baseStress + variation))
				
				chartDataArray.push({
					date: new Date(weekStart),
					dateLabel: weekStart.toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
					stressLevel: parseFloat(stressLevel.toFixed(1)),
				})
			}
			
			setChartData(chartDataArray)
			setLoading(false)
		}

		generateMockData()
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

		const maxStress = d3.max(chartData, d => d.stressLevel) || 100
		const minStress = d3.min(chartData, d => d.stressLevel) || 0
		const yScale = d3
			.scaleLinear()
			.domain([Math.max(0, minStress - 10), Math.min(100, maxStress + 10)])
			.nice()
			.range([height, 0])

		// Oblicz linię trendu (regresja liniowa)
		const n = chartData.length
		const sumX = chartData.reduce((sum, d, i) => sum + i, 0)
		const sumY = chartData.reduce((sum, d) => sum + d.stressLevel, 0)
		const sumXY = chartData.reduce((sum, d, i) => sum + i * d.stressLevel, 0)
		const sumX2 = chartData.reduce((sum, d, i) => sum + i * i, 0)
		
		const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
		const intercept = (sumY - slope * sumX) / n
		
		const trendLine = chartData.map((d, i) => ({
			date: d.date,
			stressLevel: intercept + slope * i,
		}))

		// Linia danych
		const line = d3
			.line()
			.x(d => xScale(d.date))
			.y(d => yScale(d.stressLevel))
			.curve(d3.curveMonotoneX)

		// Linia trendu
		const trendLineGenerator = d3
			.line()
			.x(d => xScale(d.date))
			.y(d => yScale(d.stressLevel))

		// Rysuj linię danych
		g.append('path')
			.datum(chartData)
			.attr('fill', 'none')
			.attr('stroke', '#4A90E2')
			.attr('stroke-width', 2.5)
			.attr('d', line)

		// Rysuj linię trendu (przerywaną)
		g.append('path')
			.datum(trendLine)
			.attr('fill', 'none')
			.attr('stroke', '#E24A4A')
			.attr('stroke-width', 2)
			.attr('stroke-dasharray', '5,5')
			.attr('opacity', 0.8)
			.attr('d', trendLineGenerator)

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
			.style('font-size', '14px')
			.style('font-weight', '500')
			.style('fill', '#666')
			.text('Poziom stresu (%)')

		// Legenda
		const legend = g.append('g').attr('transform', `translate(${width - 120}, 20)`)

		// Legenda dla linii danych
		const legendData = legend.append('g').attr('transform', 'translate(0, 0)')
		legendData
			.append('line')
			.attr('x1', 0)
			.attr('x2', 20)
			.attr('y1', 0)
			.attr('y2', 0)
			.attr('stroke', '#4A90E2')
			.attr('stroke-width', 2.5)
		legendData
			.append('text')
			.attr('x', 25)
			.attr('y', 4)
			.style('font-size', '12px')
			.style('fill', '#666')
			.text('Poziom stresu')

		// Legenda dla linii trendu
		const legendTrend = legend.append('g').attr('transform', 'translate(0, 20)')
		legendTrend
			.append('line')
			.attr('x1', 0)
			.attr('x2', 20)
			.attr('y1', 0)
			.attr('y2', 0)
			.attr('stroke', '#E24A4A')
			.attr('stroke-width', 2)
			.attr('stroke-dasharray', '5,5')
			.attr('opacity', 0.8)
		legendTrend
			.append('text')
			.attr('x', 25)
			.attr('y', 4)
			.style('font-size', '12px')
			.style('fill', '#666')
			.text('Trend')

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

