import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'All', value: 14 },
  { name: 'Completed', value: 5 },
  { name: 'Urgent', value: 2 },
  { name: 'Outstanding', value: 7, active: true }
];
const COLORS = ['#0088FE', '#6c757d', '#EF5D28', '#FFBB28', 'green'];

function ProgressChart ({}) {

    const [activeIndex, setActiveIndex] = useState("");

    const onClickActiveItem = () => {
        setActiveIndex(activeIndex -1)
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
    )


    return (
        <ResponsiveContainer minHeight={500}>
          <PieChart >
            <Legend
                verticalAlign='top'
                height={30}>
            </Legend>
            <Pie
              activeIndex={0}
              activeShape={renderActiveShape}
              data={data}
              innerRadius={70}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            
          </PieChart>
          </ResponsiveContainer>
        );
}

export default ProgressChart;