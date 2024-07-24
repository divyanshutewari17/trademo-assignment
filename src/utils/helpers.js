export const processStockData = (data) => {
    return data.map(item => ({
      name: item['Product Name'] || '',
      stock: parseInt(item['Stock Quantity'], 10) || 0,
    })).filter(item => item.name);
  };

 export const processShipmentData = (data) => {
    const originMap = data.reduce((acc, item) => {
      if (item.Origin) {
        acc[item.Origin] = acc[item.Origin] ? acc[item.Origin] + 1 : 1;
      }
      return acc;
    }, {});
    return Object.keys(originMap).map((key) => ({
      origin: key,
      count: originMap[key],
    }));
  };

 export const processProductCategoryData = (data) => {
    const categoryMap = data.reduce((acc, item) => {
      if (item.Category) {
        acc[item.Category] = acc[item.Category] ? acc[item.Category] + 1 : 1;
      }
      return acc;
    }, {});
    return Object.keys(categoryMap).map((key) => ({
      category: key,
      count: categoryMap[key],
    }));
  };