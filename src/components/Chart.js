import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const Chart = ({ data, dataKey, barKey, barColor, title }) => {
  return (
    <Paper elevation={3} className="chart-container">
      <Box p={2}>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={barKey} fill={barColor} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default Chart;
