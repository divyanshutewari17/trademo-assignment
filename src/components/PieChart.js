import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const PieChartComponent = ({ data, dataKey, nameKey, colors, title }) => {
  return (
    <Paper elevation={3} className="pie-chart-container">
      <Box p={2}>
        <Typography variant="h6" component="h3" gutterBottom textAlign={'center'}>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PieChartComponent;
