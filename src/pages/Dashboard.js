import React, { useState, useEffect, Suspense, lazy } from 'react';
import Papa from 'papaparse';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Dashboard.css';

const Chart = lazy(() => import('../components/Chart'));
const Table = lazy(() => import('../components/Table'));

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, suppliersResponse, shipmentsResponse] = await Promise.all([
          fetch('/data/products.csv').then(response => response.text()),
          fetch('/data/suppliers.csv').then(response => response.text()),
          fetch('/data/shipments.csv').then(response => response.text()),
        ]);

        const productsData = Papa.parse(productsResponse, { header: true, skipEmptyLines: true }).data;
        const suppliersData = Papa.parse(suppliersResponse, { header: true, skipEmptyLines: true }).data;
        const shipmentsData = Papa.parse(shipmentsResponse, { header: true, skipEmptyLines: true }).data;

        setProducts(productsData);
        setSuppliers(suppliersData);
        setShipments(shipmentsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processProductCategoryData = (data) => {
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

  const processStockData = (data) => {
    return data.map(item => ({
      name: item['Product Name'] || '',
      stock: parseInt(item['Stock Quantity'], 10) || 0,
    })).filter(item => item.name);
  };

  const processShipmentData = (data) => {
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

  const productCategoryColumns = [
    { key: 'Product ID', label: 'Product ID' },
    { key: 'Product Name', label: 'Product Name' },
    { key: 'Category', label: 'Category' },
    { key: 'Unit Price', label: 'Unit Price' },
    { key: 'Stock Quantity', label: 'Stock Quantity' },
  ];

  const shipmentColumns = [
    { key: 'Shipment ID', label: 'Shipment ID' },
    { key: 'Date', label: 'Date' },
    { key: 'Origin', label: 'Origin' },
    { key: 'Destination', label: 'Destination' },
    { key: 'Product ID', label: 'Product ID' },
    { key: 'Quantity', label: 'Quantity' },
    { key: 'Supplier ID', label: 'Supplier ID' },
    { key: 'Transport Mode', label: 'Transport Mode' },
  ];

  const supplierColumns = [
    { key: 'Supplier ID', label: 'Supplier ID' },
    { key: 'Supplier Name', label: 'Supplier Name' },
    { key: 'Country', label: 'Country' },
    { key: 'Contact Person', label: 'Contact Person' },
    { key: 'Contact Email', label: 'Contact Email' },
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <Suspense fallback={<div className="loading-text">Loading components...</div>}>
          <Tabs selectedIndex={selectedIndex} onSelect={index => setSelectedIndex(index)} className="dashboard-tabs">
            <TabList className="dashboard-tablist">
              <Tab className={`dashboard-tab ${selectedIndex === 0 ? 'selected' : ''}`}>Products</Tab>
              <Tab className={`dashboard-tab ${selectedIndex === 1 ? 'selected' : ''}`}>Suppliers</Tab>
              <Tab className={`dashboard-tab ${selectedIndex === 2 ? 'selected' : ''}`}>Shipments</Tab>
            </TabList>

            <TabPanel className={`dashboard-tabpanel ${selectedIndex === 0 ? 'active' : ''}`}>
              <Table columns={productCategoryColumns} data={products} />
              <Chart
                data={processProductCategoryData(products)}
                dataKey="category"
                barKey="count"
                barColor="#1e90ff"
                title="Product Categories"
              />
              <Chart
                data={processStockData(products)}
                dataKey="name"
                barKey="stock"
                barColor="#32cd32"
                title="Stock Quantities"
              />
            </TabPanel>

            <TabPanel className={`dashboard-tabpanel ${selectedIndex === 1 ? 'active' : ''}`}>
              <Table columns={supplierColumns} data={suppliers} />
            </TabPanel>

            <TabPanel className={`dashboard-tabpanel ${selectedIndex === 2 ? 'active' : ''}`}>
              <Table columns={shipmentColumns} data={shipments} />
              <Chart
                data={processShipmentData(shipments)}
                dataKey="origin"
                barKey="count"
                barColor="#ff4500"
                title="Shipment Origins"
              />
            </TabPanel>
          </Tabs>
        </Suspense>
      )}
    </div>
  );
};

export default Dashboard;
