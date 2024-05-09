import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './table.css';

const Songs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [sortedField, setSortedField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentItems, setCurrentItems] = useState([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      // Sort currentItems based on the selected field and sorting order
  const sortedItems = [...currentItems].sort((a, b) => {
    const aValue = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
    const bValue = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  setCurrentItems(sortedItems);
  };

  const handleDownloadCSV = () => {
  // Convert currentItems to CSV format
  const csvContent = convertToCSV(currentItems);

  // Create a Blob object for the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv' });

  // Create a temporary URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = 'songs_data.csv';

  // Simulate a click on the link to trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up by revoking the temporary URL
  window.URL.revokeObjectURL(url);
};

// Function to convert data to CSV format
const convertToCSV = (data) => {
  const headers = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(item => Object.values(item).join(',')).join('\n');
  return headers + rows;
};

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    // Fetch data from backend API
    axios.get(`http://localhost:5000/api/songs?page=${currentPage}&page_size=${itemsPerPage}`)
      .then(response => {
        // Handle successful response
        setCurrentItems(response.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error fetching data:', error);
      });
  }, [currentPage]); // Make sure to include currentPage in the dependencies array

  return (
    <div className="songs-container">
      <table className="songs-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('index')}>ID</th>
            <th onClick={() => handleSort('id')}>Song ID</th>
            <th onClick={() => handleSort('title')}>Title</th>
            <th onClick={() => handleSort('danceability')}>Danceability</th>
            <th onClick={() => handleSort('energy')}>Energy</th>
            <th onClick={() => handleSort('mode')}>Mode</th>
            <th onClick={() => handleSort('acousticness')}>Acousticness</th>
            <th onClick={() => handleSort('tempo')}>Tempo</th>
            <th onClick={() => handleSort('duration_ms')}>Duration (ms)</th>
            <th onClick={() => handleSort('num_sections')}>Num Sections</th>
            <th onClick={() => handleSort('num_segments')}>Num Segments</th>
            <th onClick={() => handleSort('rating')}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.index}</td>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.danceability}</td>
              <td>{item.energy}</td>
              <td>{item.mode}</td>
              <td>{item.acousticness}</td>
              <td>{item.tempo}</td>
              <td>{item.duration_ms}</td>
              <td>{item.num_sections}</td>
              <td>{item.num_segments}</td>
              <td>{item.rating}</td>
            </tr>
          )).slice(indexOfFirstItem, indexOfLastItem)} {/* Use slice to paginate the items */}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(currentItems.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />
      <button onClick={handleDownloadCSV}>Download CSV</button>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  console.log("pageNumbers: ",pageNumbers,"totalPages: ",totalPages)
  return (
    <div className="pagination">
      {pageNumbers.map(number => (

        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={currentPage === number ? 'active' : ''}
        >

          {number}
        </button>
      ))}
    </div>
  );
};

export default Songs;
