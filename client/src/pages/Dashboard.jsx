import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { 
  Button, Paper, Typography, Box, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, IconButton, Tooltip, Divider, List, ListItem, ListItemText 
} from '@mui/material';
import { 
  LogoutOutlined, Security, Storage, Add, Layers, Close, Edit, Delete, Build, Search 
} from '@mui/icons-material';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(true);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [error, setError] = useState('');

  // Asset Form State
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Available');
  const [location, setLocation] = useState('');

  // Maintenance Log Form State
  const [logNote, setLogNote] = useState('');
  const [logCost, setLogCost] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchAssets();
  }, [navigate]);

  const fetchAssets = async () => {
    try {
      const response = await API.get('/assets');
      setAssets(response.data);
    } catch (err) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/assets', { name, serialNumber, category, status, location });
      resetForm();
      setShowAddModal(false);
      fetchAssets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create asset.');
    }
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.put(`/assets/${selectedAsset._id}`, { name, serialNumber, category, status, location });
      resetForm();
      setShowEditModal(false);
      fetchAssets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update asset.');
    }
  };

  const handleDeleteAsset = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await API.delete(`/assets/${id}`);
        fetchAssets();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete asset.');
      }
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post(`/assets/${selectedAsset._id}/maintenance`, {
        note: logNote,
        cost: Number(logCost) || 0,
        performedBy: user.name
      });
      setLogNote('');
      setLogCost('');
      setShowLogModal(false);
      fetchAssets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add maintenance log.');
    }
  };

  const openEdit = (asset) => {
    setSelectedAsset(asset);
    setName(asset.name);
    setSerialNumber(asset.serialNumber);
    setCategory(asset.category);
    setStatus(asset.status);
    setLocation(asset.location);
    setShowEditModal(true);
  };

  const openLogs = (asset) => {
    setSelectedAsset(asset);
    setShowLogModal(true);
  };

  const resetForm = () => {
    setName('');
    setSerialNumber('');
    setCategory('');
    setStatus('Available');
    setLocation('');
    setSelectedAsset(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <Box className="min-h-screen bg-slate-50 text-slate-900 p-8">
      {/* Top Navbar */}
      <Paper elevation={0} className="flex justify-between items-center bg-white border border-slate-200 px-6 py-4 rounded-2xl mb-8 shadow-xs">
        <Box>
          <Typography variant="h5" className="font-bold text-blue-600 tracking-tight">OmniServe Dashboard</Typography>
          <Typography variant="body2" className="text-slate-500">Fleet & Asset Management System</Typography>
        </Box>
        <Box className="flex items-center gap-4">
          <Box className="text-right hidden sm:block">
            <Typography variant="subtitle2" className="font-semibold text-slate-800">{user.name}</Typography>
            <Chip icon={<Security fontSize="small" />} label={user.role} size="small" className="bg-blue-50 text-blue-700 font-medium border border-blue-200 mt-0.5" />
          </Box>
          <Button variant="outlined" color="error" size="small" onClick={handleLogout} startIcon={<LogoutOutlined />} className="normal-case border-red-200 hover:bg-red-50">
            Logout
          </Button>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box className="space-y-6">
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Typography variant="h6" className="font-semibold flex items-center gap-2 text-slate-800">
            <Layers className="text-blue-600" /> Managed Assets ({filteredAssets.length})
          </Typography>

          <Box className="flex items-center gap-3 w-full sm:w-auto">
            <TextField
              size="small"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
              InputProps={{
                startAdornment: <Search className="text-slate-400 mr-2" fontSize="small" />
              }}
            />
            {(user.role === 'Admin' || user.role === 'Manager') && (
              <Button variant="contained" onClick={() => { resetForm(); setShowAddModal(true); }} startIcon={<Add />} className="bg-blue-600 hover:bg-blue-700 text-white font-medium normal-case shadow-none text-sm whitespace-nowrap">
                Add Asset
              </Button>
            )}
          </Box>
        </Box>

        {/* Asset Table */}
        <TableContainer component={Paper} elevation={0} className="border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {loadingAssets ? (
            <Box className="p-12 text-center text-slate-400">Loading inventory data...</Box>
          ) : filteredAssets.length === 0 ? (
            <Box className="p-16 text-center text-slate-400">
              <Storage className="text-4xl text-slate-300 mb-2" />
              <Typography variant="body1">No matching assets found.</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead className="bg-slate-100">
                <TableRow>
                  <TableCell className="font-semibold text-slate-600">Name</TableCell>
                  <TableCell className="font-semibold text-slate-600">Serial Number</TableCell>
                  <TableCell className="font-semibold text-slate-600">Category</TableCell>
                  <TableCell className="font-semibold text-slate-600">Status</TableCell>
                  <TableCell className="font-semibold text-slate-600">Location</TableCell>
                  <TableCell className="font-semibold text-slate-600 text-right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset._id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium text-slate-900">{asset.name}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">{asset.serialNumber}</TableCell>
                    <TableCell className="text-slate-700">{asset.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={asset.status}
                        size="small"
                        className={`font-medium ${
                          asset.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          asset.status === 'In Use' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      />
                    </TableCell>
                    <TableCell className="text-slate-700">{asset.location}</TableCell>
                    <TableCell className="text-right">
                      <Tooltip title="Maintenance History & Logs">
                        <IconButton size="small" onClick={() => openLogs(asset)} className="text-slate-500 hover:text-blue-600">
                          <Build fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {(user.role === 'Admin' || user.role === 'Manager') && (
                        <Tooltip title="Edit Asset">
                          <IconButton size="small" onClick={() => openEdit(asset)} className="text-slate-500 hover:text-blue-600">
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {user.role === 'Admin' && (
                        <Tooltip title="Delete Asset">
                          <IconButton size="small" onClick={() => handleDeleteAsset(asset._id)} className="text-slate-500 hover:text-red-600">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>

      {/* Add / Edit Dialog */}
      <Dialog open={showAddModal || showEditModal} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} maxWidth="sm" fullWidth PaperProps={{ className: 'rounded-2xl p-2' }}>
        <DialogTitle className="flex justify-between items-center font-bold text-slate-800">
          {showEditModal ? 'Edit Asset' : 'Add New Asset'}
          <IconButton onClick={() => { setShowAddModal(false); setShowEditModal(false); }} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent className="pt-2">
          {error && <Box className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</Box>}
          <form onSubmit={showEditModal ? handleUpdateAsset : handleCreateAsset} id="asset-form" className="mt-2">
            <Box className="mb-4"><TextField label="Asset Name" fullWidth required size="small" value={name} onChange={(e) => setName(e.target.value)} /></Box>
            <Box className="mb-4"><TextField label="Serial Number" fullWidth required size="small" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} /></Box>
            <Box className="mb-4"><TextField label="Category" fullWidth required size="small" value={category} onChange={(e) => setCategory(e.target.value)} /></Box>
            <Box className="mb-4">
              <TextField select label="Status" fullWidth size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="In Use">In Use</MenuItem>
                <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                <MenuItem value="Decommissioned">Decommissioned</MenuItem>
              </TextField>
            </Box>
            <Box className="mb-2"><TextField label="Location" fullWidth required size="small" value={location} onChange={(e) => setLocation(e.target.value)} /></Box>
          </form>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} color="inherit" className="normal-case text-slate-600">Cancel</Button>
          <Button type="submit" form="asset-form" variant="contained" className="bg-blue-600 hover:bg-blue-700 text-white font-medium normal-case shadow-none">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Logs Dialog */}
      <Dialog open={showLogModal} onClose={() => setShowLogModal(false)} maxWidth="sm" fullWidth PaperProps={{ className: 'rounded-2xl p-2' }}>
        <DialogTitle className="flex justify-between items-center font-bold text-slate-800">
          Maintenance Logs - {selectedAsset?.name}
          <IconButton onClick={() => setShowLogModal(false)} size="small"><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent className="pt-2">
          <Typography variant="subtitle2" className="text-slate-500 mb-4 font-mono text-xs">Serial: {selectedAsset?.serialNumber}</Typography>
          
          <form onSubmit={handleAddLog} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <Typography variant="subtitle2" className="font-semibold text-slate-700 mb-3">Log New Service Entry</Typography>
            
            <Box className="mb-4 mt-2">
              <TextField 
                label="Service Notes" 
                fullWidth 
                required 
                size="small" 
                multiline 
                rows={2} 
                value={logNote} 
                onChange={(e) => setLogNote(e.target.value)} 
                placeholder="Describe work done or issue..." 
              />
            </Box>

            <Box className="mb-4">
              <TextField 
                label="Cost ($)" 
                type="number" 
                size="small" 
                fullWidth 
                value={logCost} 
                onChange={(e) => setLogCost(e.target.value)} 
                placeholder="0.00" 
              />
            </Box>

            <Button type="submit" variant="contained" size="small" className="bg-blue-600 text-white normal-case shadow-none">Add Record</Button>
          </form>

          <Divider className="my-4" />
          <Typography variant="subtitle2" className="font-semibold text-slate-800 mb-2">History ({selectedAsset?.maintenanceLogs?.length || 0})</Typography>
          {(!selectedAsset?.maintenanceLogs || selectedAsset.maintenanceLogs.length === 0) ? (
            <Typography variant="body2" className="text-slate-400 italic">No maintenance history recorded for this asset.</Typography>
          ) : (
            <List className="divide-y divide-slate-100">
              {selectedAsset.maintenanceLogs.map((log, index) => (
                <ListItem key={index} className="px-0 py-2">
                  <ListItemText
                    primary={log.note}
                    secondary={`${new Date(log.date).toLocaleDateString()} • Tech: ${log.performedBy} • Cost: $${log.cost}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Dashboard;