import React, { useState, useEffect, Suspense, lazy, startTransition } from 'react';
import Papa from 'papaparse';
import { Tabs, Tab, Box, Typography, CircularProgress, AppBar, Grid, Button, Modal } from '@mui/material';
import '../styles/Dashboard.css';

const Chart = lazy(() => import('../components/Chart'));
const Table = lazy(() => import('../components/Table'));
const PieChartComponent = lazy(() => import('../components/PieChart'));

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('')

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

  const handleOpenModal = () => {
    startTransition(() => {
      setOpenModal(true);
    });
  };

  const handleCloseModal = () => setOpenModal(false);

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

  const productCategoryColors = ['#8884d8', '#8dd1e1', '#82ca9d', '#ffc658'];

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
      <Typography variant="h4" className="dashboard-title" sx={{ textAlign: 'center', mb: 1 }}>Dashboard</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
          <Typography className="loading-text">Loading...</Typography>
        </Box>
      ) : (
        <Suspense fallback={<Box className="loading-text">Loading components...</Box>}>
          <AppBar position="static" color="default">
            <Tabs
              value={selectedIndex}
              onChange={(e, newValue) => setSelectedIndex(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Products" />
              <Tab label="Suppliers" />
              <Tab label="Shipments" />
            </Tabs>
          </AppBar>
          <TabPanel value={selectedIndex} index={0}>
            <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
              <Button variant="contained" color="primary" onClick={()=> {
                handleOpenModal(); 
                setModalType('product')} 
              }>Show Charts</Button>
            </Box>
            <Table columns={productCategoryColumns} data={products} />
          </TabPanel>
          <TabPanel value={selectedIndex} index={1}>
            
            <Table columns={supplierColumns} data={suppliers} />
          </TabPanel>
          <TabPanel value={selectedIndex} index={2}>
            <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button variant="contained" color="primary" onClick={()=> {
                handleOpenModal(); 
                setModalType('shipment')} 
              }>Show Charts</Button>
            </Box>
            <Table columns={shipmentColumns} data={shipments} />
          </TabPanel>
        </Suspense>
      )}
      {
        modalType === 'product' &&
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <Typography id="modal-title" variant="h6" component="h2">
              Product Analysis
            </Typography>
            <Suspense fallback={<Box className="loading-text">Loading components...</Box>}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={8}>
                  <Chart
                    data={processStockData(products)}
                    dataKey="name"
                    barKey="stock"
                    barColor="#32cd32"
                    title="Stock Quantities"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <PieChartComponent
                    data={processProductCategoryData(products)}
                    dataKey="count"
                    nameKey="category"
                    colors={productCategoryColors}
                    title="Product Categories Distribution"
                  />
                </Grid>
              </Grid>
            </Suspense>
          </Box>
        </Modal>
      }
      {
        modalType === 'shipment' &&
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <Typography id="modal-title" variant="h6" component="h2">
              Shipment Charts
            </Typography>
            <Suspense fallback={<Box className="loading-text">Loading components...</Box>}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Chart
                    data={processShipmentData(shipments)}
                    dataKey="origin"
                    barKey="count"
                    barColor="#ff4500"
                    title="Shipment Origins"
                  />
                </Grid>
              </Grid>
            </Suspense>
          </Box>
        </Modal>
      }
      
    </div>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default Dashboard;
