import React from 'react';
import { Table as MuiTable, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer } from '@mui/material';
import '../styles/Table.css';

const Table = ({ columns, data }) => {
  return (
    <TableContainer component={Paper} className="table-container">
      <MuiTable className="table">
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map(col => (
                <TableCell key={col.key}>{row[col.key] || 'N/A'}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
