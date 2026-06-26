import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to send message');
      
      setStatus({ loading: false, error: '', success: true });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-transparent">
      <SEO title="Contact Us | ThreadMarket" />
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display text-pearl mb-6"
        >
          Get in Touch
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
        >
          <div className="bg-midnight/50 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-display text-gold mb-4">Customer Support</h3>
            <p className="text-gray-300 font-sans mb-2">Email: support@threadmarket.com</p>
            <p className="text-gray-300 font-sans mb-6">Phone: +92 300 1234567</p>
            <p className="text-gray-500 font-sans text-sm">Available Mon-Fri, 9am - 6pm PKT</p>
          </div>
          
          <div className="bg-midnight/50 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-display text-electric mb-4">Send a Message</h3>
            {status.success && (
              <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded text-sm font-sans">
                Your message has been sent successfully. We will get back to you soon!
              </div>
            )}
            {status.error && (
              <div className="mb-4 bg-crimson/10 border border-crimson/30 text-crimson p-3 rounded text-sm font-sans">
                {status.error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className="w-full bg-void border border-white/10 rounded-lg px-4 py-2 text-pearl focus:border-electric outline-none font-sans" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full bg-void border border-white/10 rounded-lg px-4 py-2 text-pearl focus:border-electric outline-none font-sans" />
              <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Message" rows="3" className="w-full bg-void border border-white/10 rounded-lg px-4 py-2 text-pearl focus:border-electric outline-none font-sans"></textarea>
              <button disabled={status.loading} className="w-full bg-white/10 text-white font-sans font-medium uppercase tracking-wider py-3 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50">
                {status.loading ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
