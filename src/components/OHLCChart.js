import React, {useState} from 'react';
import { UncontrolledTooltip } from 'reactstrap';

const OHLCChart = (prop) => {

		const data = prop.data;
		
		const [chartItems] = useState([]);

		let chartHeight = 400;
		let resultsData = [];
		
		if (!data && data === undefined && data === null) {
			return false;
		}

		if (data['Note']){
			return <div>
				{data['Note']}
			</div>;
		}

		data && Object.keys(data['Time Series (Daily)']).map((val, index) =>
			resultsData.push({
				date: val,
				lineInterval: (index + 1) * 40,
				openPrice: parseFloat(data['Time Series (Daily)'][val]['1. open']),
				highPrice: parseFloat(data['Time Series (Daily)'][val]['2. high']),
				lowPrice: parseFloat(data['Time Series (Daily)'][val]['3. low']),
				closePrice: parseFloat(data['Time Series (Daily)'][val]['4. close'])
			})
		);

		const highestPrice = [...resultsData].sort((a, b) => b.highPrice - a.highPrice)[0].highPrice;
		const chartWidth = [...resultsData].sort((a, b) => b.lineInterval - a.lineInterval)[0].lineInterval;
		
		const scales = parseFloat(chartHeight / highestPrice );

		resultsData.length > 0 && resultsData.map((val, index) => {
			const date = val.date;
			const lineInterval = val.lineInterval;
			const openPrice = parseFloat(val.openPrice * scales).toFixed(2);
			const highPrice = parseFloat(val.highPrice * scales).toFixed(2);
			const lowPrice = parseFloat(val.lowPrice * scales).toFixed(2);
			const closePrice = parseFloat(val.closePrice * scales).toFixed(2);
			const fill = openPrice > closePrice ? '#dc3545' : '#28a745';

			const childItem = <React.Fragment>
					
								<line id={`x-${index}`} x1={lineInterval} y1="10" x2={lineInterval} y2={chartHeight + 10}
										stroke="#eeeeee"
										strokeWidth="0.5"/>
								<g id={`chartTooltip-${index}`} className="chartLine">
									<path fill={fill} stroke={fill} strokeWidth="2" d={`M ${lineInterval} ${highPrice} L ${lineInterval} ${lowPrice} M ${lineInterval - 11} ${closePrice} L ${lineInterval} ${closePrice} M ${lineInterval} ${openPrice} L ${lineInterval + 11} ${openPrice}`}></path>
								</g>
								<UncontrolledTooltip key={`${val.date} - ${index} - tooltip`} placement="left" target={`chartTooltip-${index}`} transform={`translate(${lineInterval},30)`}>
									{`${date}`}<br/>
									{`Open: ${val.openPrice}`}<br/>
									{`High: ${val.highPrice}`}<br/>
									{`Low: ${val.lowPrice}`}<br/>
									{`Close: ${val.closePrice}`}<br/>
								</UncontrolledTooltip>
								
								<g>
									<text transform={`rotate(-30, ${lineInterval}, 500)`} x={lineInterval} y="440" fill="#686868" fontSize="10px" fontStyle="Normal" fontFamily="Segoe UI" fontWeight="Normal">{date}</text>
								</g>
							</React.Fragment>;

			chartItems.push(childItem);
			
			return chartItems;
		});

		const generateChart = () => 
			<svg width={chartWidth + 30} height={chartHeight + 50}>
				<g>
					<rect fill="#FFFFFF" stroke="#DDDDDD" strokeWidth="0" y="0" x="0" height={chartHeight} width="100%" rx="0" ry="0"></rect>
					<rect fill="transparent" stroke="#dbdbdb" strokeWidth="0.5" y="10.25" x="40.5" height={chartHeight} width="100%" rx="0" ry="0"></rect>
					
					{[...chartItems]}
				</g>
			</svg>;

		return (
			<div className="ChartWrapper">
				{generateChart()}
			</div>
		);
}

export default OHLCChart;
