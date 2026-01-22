import create from 'zustand';

/**
 * Global state management using Zustand
 * Manages: dataset, filters, UI state, visualization settings
 */
const useStore = create((set, get) => ({
  // Dataset state
  datasetInfo: null,
  chartData: null,
  sampleData: null,
  wordFrequencies: null,
  fileType: null,
  
  // Filter state
  activeFilters: {},
  filteredRows: null,
  
  // UI state
  message: null,
  messageType: '', // 'error', 'success', 'info'
  isLoading: false,
  selectedColumn: null,
  
  // Visualization settings
  darkMode: localStorage.getItem('darkMode') === 'true' || false,
  selectedVisualization: 'auto', // 'auto', 'recharts', 'plotly', 'd3'
  
  // Actions
  setDatasetInfo: (info) => set({ datasetInfo: info }),
  setChartData: (data) => set({ chartData: data }),
  setSampleData: (data) => set({ sampleData: data }),
  setWordFrequencies: (freqs) => set({ wordFrequencies: freqs }),
  setFileType: (type) => set({ fileType: type }),
  
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  setFilteredRows: (count) => set({ filteredRows: count }),
  
  setMessage: (message, type = 'info') => {
    set({ message, messageType: type });
    setTimeout(() => set({ message: null }), 5000);
  },
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedColumn: (column) => set({ selectedColumn: column }),
  
  toggleDarkMode: () => {
    const isDark = !get().darkMode;
    localStorage.setItem('darkMode', isDark);
    set({ darkMode: isDark });
  },
  setSelectedVisualization: (vis) => set({ selectedVisualization: vis }),
  
  // Reset state
  resetAll: () => set({
    datasetInfo: null,
    chartData: null,
    sampleData: null,
    wordFrequencies: null,
    fileType: null,
    activeFilters: {},
    filteredRows: null,
    selectedColumn: null,
    message: null
  }),
}));

export default useStore;
