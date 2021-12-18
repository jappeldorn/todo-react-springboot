import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Label } from 'recharts';


const COLORS = ['#0088FE', '#6c757d', '#EF5D28', '#FFBB28'];

function ProgressChart ({ data }) {

    const [activeIndex, setActiveIndex] = useState("");

    const onClickActiveItem = () => {
        setActiveIndex(activeIndex -1)
    }

    const onClickItem = (item, i) => {
      if (activeIndex !== i) {
          setActiveIndex(i);
      }
    }

    const renderActiveShape = (item) => (
        <Sector
            cursor='pointer'
            cx={item.cx}
            cy={item.cy}
            fill={item.fill}
            startAngle={item.startAngle}
            endAngle={item.endAngle}
            innerRadius={item.innerRadius - 4}
            outerRadius={item.outerRadius + 7}
            onClick={onClickActiveItem}
        />
    );

    let totalCount = 0;
		const chartData = data.map((d, i) => {
			totalCount += d.count;
			return {
				cursor: 'pointer',
				fillOpacity: (activeIndex < 0 || activeIndex === i) ? 1 : 0.5,
				visibility: d.count === 0 ? 'hidden' : 'visible',
				...d
			};
		});

    const allEmpty = !chartData || chartData.length === 0;
		if (allEmpty) {
			chartData.push({
				count: 1,
				fill: '#DDD',
				status: null
			});
		}

    const label = allEmpty ? false : (item) => {
			if (totalCount > 0 && item.count > 0) {
				const percentage = `${Math.round((item.count / totalCount) * 100)}% `;
				return `${percentage}(${item.count})`;
			}
			return item.count;
		};

    const pieProps = {
			activeIndex: activeIndex,
			activeShape: renderActiveShape,
			animationBegin: 10,
			data: chartData,
			dataKey: 'count',
			innerRadius: '70%',
			isAnimationActive: activeIndex === -1,
			label,
			labelLine: !!label,
			nameKey: 'status',
			onClick: allEmpty ? null : onClickItem,
			outerRadius: '90%'
		};


    return (
        <ResponsiveContainer minHeight={500}>
          <PieChart >
            <Legend
                verticalAlign='top'
                height={30}>
            </Legend>
            <Pie {...pieProps} >
              <Label fontSize={40} position='center' value='No Tasks' />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            
          </PieChart>
          </ResponsiveContainer>
        );
}

export default ProgressChart;