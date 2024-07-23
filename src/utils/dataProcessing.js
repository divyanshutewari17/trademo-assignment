// Helper functions to process CSV data

export const processChartData = (data) => {
    // Example processing for chart data
    // Assuming data is an array of objects
    return data.map(item => ({
      x: item.date,
      y: item.value,
    }));
  };
  
  export const processTableData = (data) => {
    // Example processing for table data
    // Assuming data is an array of objects
    return data.map(item => ({
      id: item.id,
      name: item.name,
      value: item.value,
    }));
  };
  