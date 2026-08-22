// Community.jsx
import React, { useState } from 'react';
import { Search, MessageSquare, ThumbsUp, Share2, Filter, Plus, Send, AlertCircle } from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Essential Goa Travel Tips for First-Timers",
    author: "Rohan K.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    category: "Tips",
    tags: ["Goa", "Beaches", "Budget"],
    content: "Avoid South Goa if you want loud nightlife; North Goa is where the clubs are. Renting a scooter for ₹300-₹400/day is the best way to get around! Also, try the local fish thali at local shacks—it's cheap and delicious.",
    likes: 42,
    comments: 8,
    date: "2 days ago",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
  },
  {
    id: 2,
    title: "7-Day Rajasthan Itinerary: Palaces and Deserts",
    author: "Shriti Sen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    category: "Itinerary",
    tags: ["Rajasthan", "Jaipur", "Udaipur"],
    content: "Jaipur, Jodhpur, and Udaipur can easily be covered in a week. Buy the composite entry ticket at Amber Fort to save money. The sunset boat cruise at Lake Pichola in Udaipur is worth every rupee!",
    likes: 128,
    comments: 24,
    date: "1 week ago",
    image: "https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=600"
  },
  {
    id: 3,
    title: "Kashmir Travel Experiences in Autumn",
    author: "Zahid Ahmed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    category: "Experiences",
    tags: ["Kashmir", "Srinagar", "Adventure"],
    content: "Autumn is spectacular in Srinagar! The Chinar tree leaves turn deep golden red. Stay at least 2 nights on a houseboat on Nigeen Lake rather than Dal Lake for a peaceful experience, and take a day trip to Sonamarg.",
    likes: 95,
    comments: 14,
    date: "3 days ago",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600"
  },
  {
    id: 4,
    title: "Manali Recommendations: Snow & Solang Valley Adventure",
    author: "Pooja Hegde",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    category: "Adventure",
    tags: ["Manali", "Himalayas", "Trekking"],
    content: "If you're heading to Rohtang Pass, make sure to book the permits online a day in advance! Solang Valley is amazing for paragliding, but negotiate rates directly rather than going through agents.",
    likes: 74,
    comments: 11,
    date: "5 days ago",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600"
  },
  {
    id: 5,
    title: "Budget Travel in India: Backpacking across Varanasi & Rishikesh",
    author: "Amit Mishra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    category: "Budget",
    tags: ["Varanasi", "Rishikesh", "Spirituality"],
    content: "Rishikesh offers shared hostels for just ₹400/night. Walk everywhere or use shared autos (Vikrams) for ₹10-₹20. Attend the Ganga Aarti in Varanasi early—it gets super crowded, but it is an unforgettable spiritual sight.",
    likes: 112,
    comments: 19,
    date: "4 days ago",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?w=600"
  },
  {
    id: 6,
    title: "International Travel Tips: EuroTrip on a Budget",
    author: "Kabir Roy",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100",
    category: "Tips",
    tags: ["Paris", "Rome", "Europe"],
    content: "When visiting Paris or Rome, book attraction tickets weeks in advance to avoid 3-hour ticket lines. Use budget flights like Ryanair or trains. Always carry a refillable water bottle—public water fountains in Rome are free and clean!",
    likes: 165,
    comments: 32,
    date: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"
  }
];

export default function Community() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // New Post Form State
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Tips');
  const [newTags, setNewTags] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLike = (id) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    setPosts(updated);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    setError('');

    if (!newTitle || !newContent) {
      setError("Please fill in the title and content.");
      return;
    }

    const tagsArray = newTags.split(',').map(t => t.trim()).filter(t => t !== '');
    const newPostObj = {
      id: Date.now(),
      title: newTitle,
      author: "You (Explorer)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      category: newCategory,
      tags: tagsArray.length > 0 ? tagsArray : ["General"],
      content: newContent,
      likes: 0,
      comments: 0,
      date: "Just now",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600" // default trip cover
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowNewPostForm(false);
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Tips', 'Itinerary', 'Experiences', 'Adventure', 'Budget'];

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>GlobeTrotter Community Hub</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Share guidelines, recommend budget tricks, and find itineraries written by travellers.
          </p>
        </div>
        <button 
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>{showNewPostForm ? "Cancel Post" : "Share Experience"}</span>
        </button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <form onSubmit={handleAddPost} className="card" style={styles.newPostForm}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Write a Community Post</h3>
          {error && (
            <div style={styles.errorAlert}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Post Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Budget hacks for lodging in Jaipur"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-input"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              >
                <option value="Tips">Tips & Hacks</option>
                <option value="Itinerary">Itinerary Ideas</option>
                <option value="Experiences">Travel Experience</option>
                <option value="Adventure">Adventure</option>
                <option value="Budget">Budget Backpacking</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Goa, nightlife, scooter"
                value={newTags}
                onChange={e => setNewTags(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Post Content *</label>
            <textarea 
              className="form-input" 
              style={{ minHeight: '100px', resize: 'vertical' }}
              placeholder="Write detailed recommendations or descriptions..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100px' }}>Publish</button>
        </form>
      )}

      {/* Search & Filters */}
      <div className="card" style={styles.filterCard}>
        <div style={styles.searchRow}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search posts by tags, locations or content (e.g. Goa, Paris, backpack)..." 
            className="form-input" 
            style={{ paddingLeft: '40px' }}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div style={styles.categoryFilters}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Filter Categories:</span>
          <div style={styles.tabsRow}>
            {categories.map(c => (
              <button 
                key={c}
                onClick={() => setSelectedCategory(c)}
                style={{
                  ...styles.tabBtn,
                  backgroundColor: selectedCategory === c ? 'var(--primary)' : 'transparent',
                  color: selectedCategory === c ? 'var(--text-white)' : 'var(--text-muted)',
                  borderColor: selectedCategory === c ? 'var(--primary)' : 'var(--border)'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Stack */}
      <div style={styles.postsContainer}>
        {filteredPosts.length === 0 ? (
          <div className="card flex-center" style={{ padding: '60px 20px', textAlign: 'center', flexDirection: 'column' }}>
            <MessageSquare size={36} color="var(--text-light)" />
            <h4>No Community Posts Found</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="card" style={styles.postCard}>
              <div style={styles.postHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={post.avatar} alt={post.author} style={styles.authorAvatar} />
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{post.author}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>{post.date}</span>
                  </div>
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>{post.category}</span>
              </div>

              <div style={styles.postLayout}>
                <div style={styles.postContentCol}>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <p style={styles.postContent}>{post.content}</p>
                  <div style={styles.tagsRow}>
                    {post.tags.map(t => (
                      <span key={t} style={styles.tagBadge}>#{t}</span>
                    ))}
                  </div>
                </div>
                <img src={post.image} alt="Post Cover" style={styles.postImg} />
              </div>

              <div style={styles.postFooter}>
                <button onClick={() => handleLike(post.id)} style={styles.interactionBtn}>
                  <ThumbsUp size={14} />
                  <span>{post.likes} Likes</span>
                </button>
                <div style={styles.interactionBtn}>
                  <MessageSquare size={14} />
                  <span>{post.comments} Comments</span>
                </div>
                <button style={{ ...styles.interactionBtn, marginLeft: 'auto' }}>
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  newPostForm: {
    padding: '20px',
    marginBottom: '24px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px',
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.8rem',
    marginBottom: '12px',
  },
  filterCard: {
    padding: '20px',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  searchRow: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-light)',
  },
  categoryFilters: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  tabsRow: {
    display: 'flex',
    gap: 8,
  },
  tabBtn: {
    padding: '4px 12px',
    fontSize: '0.8rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    fontWeight: 600,
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  postCard: {
    padding: '20px',
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px',
    marginBottom: '12px',
  },
  authorAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    objectFit: 'cover',
  },
  postLayout: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  postContentCol: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  postTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: 0,
  },
  postContent: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: 1.45,
  },
  tagsRow: {
    display: 'flex',
    gap: 8,
  },
  tagBadge: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: 600,
  },
  postImg: {
    width: '140px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)',
  },
  postFooter: {
    display: 'flex',
    gap: 20,
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
    marginTop: '16px',
    fontSize: '0.8rem',
    color: 'var(--text-light)',
  },
  interactionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    color: 'var(--text-light)',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color var(--transition-fast)',
    ':hover': {
      color: 'var(--primary)',
    }
  }
};
