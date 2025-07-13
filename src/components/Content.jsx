import { useEffect, useState } from 'react';
import axios from 'axios';
import './content.css';
import { useNavigate } from 'react-router-dom';


export default function Content() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    category: '',
    price: '',
    stock: '',
    expiry_date: '',
  });

  const [mlData, setMlData] = useState({}); // Stores predictions keyed by item _id

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    axios.get('http://localhost:4000/items')
      .then(res => {
        setItems(res.data);
        fetchPredictions(res.data);
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  const fetchPredictions = async (itemsList) => {
    const mlResults = {};
    for (const item of itemsList) {
      const daysLeft = calculateDaysToExpiry(item.expiry_date);
      try {
        const response = await axios.post('http://localhost:4000/api/predict', {
          stock: Number(item.stock), // hardcoded stock
          price: Number(item.price),
          days_to_expiry: daysLeft
        });
        console.log("ML API Response for", item.name, "=>", response.data);
        mlResults[item._id] = response.data || {};
      } catch (err) {
        console.error("ML fetch error:", err);
        mlResults[item._id] = { sold_ratio: "N/A", discount: "N/A" };
      }
    }
    setMlData(mlResults);
  };

  const getSoldRatioStatus = (ratio) => {
  if (ratio < 0.3) return { color: 'red', label: '⚠️ Overstocked' };
  if (ratio < 0.7) return { color: 'orange', label: '📉 Moderate Sale' };
  return { color: 'green', label: '🔥 Fast Selling' };
};


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/items', formData)
      .then(res => {
        const newItem = res.data;
        setItems(prev => [...prev, newItem]);
        fetchPredictions([...items, newItem]);
        setShowForm(false);
        setFormData({
          name: '',
          image: '',
          category: '',
          price: '',
          stock: '',
          expiry_date: '',
        });
      })
      .catch(err => console.error("Post error:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios.delete(`http://localhost:4000/items/${id}`)
        .then(() => {
          setItems(prevItems => prevItems.filter(item => item._id !== id));
        })
        .catch(err => console.error("Delete error:", err));
    }
  };
 const handleGetAlerts = () => {
    navigate('/alerts');
  };
  const calculateDaysToExpiry = (expiryDate) => {
    const today = new Date();
    const exp = new Date(expiryDate);
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading items...</p>;

  return (
    <div className="item-page">
      <h2>Items from MongoDB</h2>
      <button className = "alert-btn"  onClick={handleGetAlerts} style={{marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#ff6666',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'}}>Get Alerts</button>
      <div className="item-grid">
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map(item => {
            const prediction = mlData[item._id] || {};
            const daysLeft = calculateDaysToExpiry(item.expiry_date);

            return (
              <div key={item._id} className={`item-card ${item.category}-item`}>
                <h3>{item.name}</h3>
                <img src={item.image} alt={item.name} />
                <p className="category">Category: {item.category}</p>
                <p className="price">Price: ₹{item.price}</p>
                <p className="stock">Stock: {item.stock}</p>
                <p className="expiry">Expiry: {new Date(item.expiry_date).toLocaleDateString()}</p>

                <div className="ml-box">
                  <p><strong>Days to Expiry:</strong> {daysLeft} days</p>
                  {prediction?.predictedSoldRatio !== undefined ? (
                    <>
                      <p>
                        <strong>Sold Ratio:</strong>{' '}
                        {(prediction.predictedSoldRatio * 100).toFixed(1)}%
                      </p>
                      <p style={{ color: getSoldRatioStatus(prediction.predictedSoldRatio).color }}>
                        {getSoldRatioStatus(prediction.predictedSoldRatio).label}
                      </p>
                      <p>
                        <strong>Predicted Discount:</strong> {prediction.recommendedDiscount}%
                      </p>
                    </>
                  ) : (
                    <>
                     <p><strong>Sold Ratio:</strong> Loading...</p>
                     <p><strong>Dynamic Discount:</strong> Loading...%</p>
                   </>
                 )}
                </div>

                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                
              </div>
            );
          })
        )}
      </div>

      <button onClick={() => setShowForm(prev => !prev)} className="add-btn">
        {showForm ? 'Close Form' : 'Add Item'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-item-form">
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          <input name="expiry_date" type="date" placeholder="Expiry Date" value={formData.expiry_date} onChange={handleChange} required />
          <button type="submit" className="btn">Submit</button>
        </form>
      )}
    </div>
  );
}













// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import './content.css';

// export default function Content() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);  
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     image: '',
//     category: '',
//     price: '',
//     expiry_date: '',
//   });

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = () => {
//     setLoading(true);
//     axios.get('http://localhost:5000/items')
//       .then(res => setItems(res.data))
//       .catch(err => console.error("Fetch error:", err))
//       .finally(() => setLoading(false));
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post('http://localhost:5000/items', formData)
//       .then(res => {
//         setItems(prev => [...prev, res.data]);
//         setShowForm(false);
//         setFormData({
//           name: '',
//           image: '',
//           category: '',
//           price: '',
//           expiry_date: '',
//         });
//       })
//       .catch(err => console.error("Post error:", err));
//   };
//   const handleDelete = (id) => {
//   if (window.confirm("Are you sure you want to delete this item?")) {
//     axios.delete(`http://localhost:5000/items/${id}`)
//       .then(() => {
//         setItems(prevItems => prevItems.filter(item => item._id !== id));
//       })
//       .catch(err => console.error("Delete error:", err));
//   }
// };


//   if (loading) return <p style={{ padding: '20px' }}>Loading items...</p>;

//   return (
//     <div className="item-page">
//       <h2>Items from MongoDB</h2>
//       <div className="item-grid">
//         {items.length === 0 ? (
//           <p>No items found.</p>
//         ) : (
//           items.map(item => (
//             <div key={item._id} className={`item-card ${item.category}-item`}>
//               <h3>{item.name}</h3>
//               <img src={item.image} alt={item.name} />
//               <p className="category">Category: {item.category}</p>
//               <p className="price">Price: ₹{item.price}</p>
//               <p className="expiry">Expiry: {new Date(item.expiry_date).toLocaleDateString()}</p>
//               <button className="delete-btn"onClick={() => handleDelete(item._id)}> Delete</button>
//             </div>  
//           ))
//         )}
//       </div>

//       <button onClick={() => setShowForm(prev => !prev)} className="add-btn">
//         {showForm ? 'Close Form' : 'Add Item'}
//       </button>

//       {showForm && (
//         <form onSubmit={handleSubmit} className="add-item-form">
//           <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
//           <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
//           <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
//           <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
//           <input name="expiry_date" type="date" placeholder="Expiry Date" value={formData.expiry_date} onChange={handleChange} required />
//           <button type="submit" className="btn">Submit</button>
//         </form>
//       )}
//     </div>
//   );
// }
