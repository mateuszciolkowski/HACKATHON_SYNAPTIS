// src/components/dashboard/Patients/BarChart.jsx
import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const BarChart = ({ data }) => {
	const svgRef = useRef()

	useEffect(() => {
		if (!data || data.length === 0) return

		const svg = d3.select(svgRef.current)
		svg.selectAll('*').remove() // Wyczyść poprzedni wykres

		// Ustawienia wykresu
		const width = 350
		const height = 200
		const margin = { top: 20, right: 20, bottom: 30, left: 40 }

		svg.attr('width', width).attr('height', height)

		// Skala X
		const xScale = d3
			.scaleBand()
			.domain(data.map((d, i) => i)) // Użyj indeksu dla osi X
			.range([margin.left, width - margin.right])
			.padding(0.1)

		// Skala Y
		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data)]) // Od 0 do max wartości
			.range([height - margin.bottom, margin.top])

		// Oś X
		const xAxis = d3.axisBottom(xScale).tickFormat(i => `W${i + 1}`) // Etykiety "W1", "W2" ...
		svg
			.append('g')
			.attr('transform', `translate(0, ${height - margin.bottom})`)
			.call(xAxis)

		// Oś Y
		const yAxis = d3.axisLeft(yScale)
		svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(yAxis)

		// Słupki
		svg
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (d, i) => xScale(i))
			.attr('y', d => yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', d => height - margin.bottom - yScale(d))
			.attr('fill', 'steelblue')
	}, [data]) // Przerenderuj, gdy zmienią się dane

	return <svg ref={svgRef}></svg>
}

export default BarChart
