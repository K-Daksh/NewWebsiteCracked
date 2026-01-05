import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  HelpCircle, 
  Milestone as MilestoneIcon,
  Image,
  TrendingUp,
  Users,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import * as api from '../api/index.js';

const Dashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    stats: 0,
    testimonials: 0,
    faqs: 0,
    milestones: 0,
    images: 0,
  });
  const [siteStats, setSiteStats] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, statsRes, testimonialsRes, faqsRes, milestonesRes, imagesRes] = await Promise.all([
        api.getEvents(),
        api.getStats(),
        api.getTestimonials(),
        api.getFaqs(),
        api.getMilestones(),
        api.listImages().catch(() => ({ data: { data: [] } })),
      ]);

      setStats({
        events: eventsRes.data.data?.length || 0,
        stats: statsRes.data.data?.length || 0,
        testimonials: testimonialsRes.data.data?.length || 0,
        faqs: faqsRes.data.data?.length || 0,
        milestones: milestonesRes.data.data?.length || 0,
        images: imagesRes.data.data?.length || 0,
      });

      setSiteStats(statsRes.data.data || []);
      setRecentEvents((eventsRes.data.data || []).slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const quickLinks = [
    { path: '/events', icon: Calendar, label: 'Events', count: stats.events, color: 'purple' },
    { path: '/stats', icon: BarChart3, label: 'Stats', count: stats.stats, color: 'blue' },
    { path: '/testimonials', icon: MessageSquare, label: 'Testimonials', count: stats.testimonials, color: 'green' },
    { path: '/faqs', icon: HelpCircle, label: 'FAQs', count: stats.faqs, color: 'yellow' },
    { path: '/milestones', icon: MilestoneIcon, label: 'Milestones', count: stats.milestones, color: 'pink' },
    { path: '/gallery', icon: Image, label: 'Images', count: stats.images, color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Welcome Back! 👋</h2>
          <p className="text-white/50 mt-1">Here's what's happening with your website</p>
        </div>
        <button 
          onClick={fetchData}
          className="btn btn-secondary"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickLinks.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="card hover:border-purple-500/50 transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 text-${item.color}-400`} />
              </div>
              <p className="text-2xl font-bold text-white">{item.count}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider mt-1">{item.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Statistics */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Site Statistics</h3>
            <Link to="/stats" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Manage <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {siteStats.map((stat, index) => (
              <div 
                key={stat.id || index} 
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    {stat.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5 text-purple-400" />}
                    {stat.icon === 'Users' && <Users className="w-5 h-5 text-purple-400" />}
                    {stat.icon === 'Globe' && <BarChart3 className="w-5 h-5 text-purple-400" />}
                    {stat.icon === 'Star' && <MilestoneIcon className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{stat.label}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Events</h3>
            <Link to="/events" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={event.images?.[0] || 'https://via.placeholder.com/64x48'} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{event.title}</p>
                    <p className="text-white/50 text-sm">{event.date}</p>
                  </div>
                  <span className={`badge ${
                    event.type === 'Ongoing' ? 'badge-green' :
                    event.type === 'Upcoming' ? 'badge-purple' :
                    'badge-gray'
                  }`}>
                    {event.type}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white/50 text-center py-8">No events yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/events" className="btn btn-secondary py-4">
            <Calendar className="w-5 h-5" />
            Add Event
          </Link>
          <Link to="/testimonials" className="btn btn-secondary py-4">
            <MessageSquare className="w-5 h-5" />
            Add Testimonial
          </Link>
          <Link to="/gallery" className="btn btn-secondary py-4">
            <Image className="w-5 h-5" />
            Upload Images
          </Link>
          <Link to="/settings" className="btn btn-secondary py-4">
            <BarChart3 className="w-5 h-5" />
            Site Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
