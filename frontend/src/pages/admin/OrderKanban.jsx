import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { FileImage, MessageCircle, Eye, X, CheckCircle } from 'lucide-react';
import axios from 'axios';

const columns = [
  { id: 'Pending', title: 'Pending Verification' },
  { id: 'Approved', title: 'Approved' },
  { id: 'Packed', title: 'Packed' },
  { id: 'Dispatched', title: 'Dispatched' },
  { id: 'Delivered', title: 'Delivered' }
];

const OrderKanban = () => {
  const [orders, setOrders] = useState([]);
  const [isBrowser, setIsBrowser] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(import.meta.env.VITE_API_URL + '/orders', { withCredentials: true });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistically update UI
    const newOrders = Array.from(orders);
    const orderIndex = newOrders.findIndex(o => o._id === draggableId);
    const originalStatus = newOrders[orderIndex].status;
    newOrders[orderIndex].status = destination.droppableId;
    
    // Auto-mark as paid if delivered, UI only for now to match drag
    if (destination.droppableId === 'Delivered') {
       newOrders[orderIndex].isPaid = true;
    }
    
    setOrders(newOrders);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${draggableId}/status`, {
        status: destination.droppableId
      }, { withCredentials: true });
      
      // If we just delivered, it updates DB isPaid inside updateOrderStatus, let's refresh to be safe
      if (destination.droppableId === 'Delivered') {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update status', error);
      // Revert on failure
      const reverted = Array.from(orders);
      reverted[orderIndex].status = originalStatus;
      setOrders(reverted);
    }
  };

  const markAsPaid = async (orderId) => {
    try {
      setPaying(true);
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/pay`, {}, { withCredentials: true });
      
      // Update local state
      const updatedOrders = orders.map(o => o._id === orderId ? { ...o, isPaid: true } : o);
      setOrders(updatedOrders);
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, isPaid: true });
      }
    } catch (error) {
      console.error('Failed to mark as paid', error);
    } finally {
      setPaying(false);
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  if (!isBrowser) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display text-pearl">Order Kanban Board</h1>
          <p className="text-gray-400 font-sans text-sm mt-1">Drag and drop to update order status.</p>
        </div>
        <button onClick={fetchOrders} className="text-sm font-sans text-electric hover:text-white transition-colors">
          {loading ? 'Refreshing...' : 'Refresh Board'}
        </button>
      </div>

      <div className="flex-1 overflow-x-auto hide-scrollbar pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 min-w-max h-full min-h-[500px]">
            {columns.map((column) => (
              <div key={column.id} className="w-80 flex flex-col bg-midnight/50 border border-white/5 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-sans font-medium text-pearl uppercase tracking-wider text-sm">{column.title}</h3>
                  <span className="bg-white/10 text-xs py-1 px-2 rounded-full text-gray-300">
                    {getOrdersByStatus(column.id).length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto space-y-3 p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-white/5 border border-dashed border-white/20' : ''
                      }`}
                    >
                      {getOrdersByStatus(column.id).map((order, index) => (
                        <Draggable key={order._id} draggableId={order._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedOrder(order)}
                              className={`bg-void border p-4 rounded-lg shadow-lg cursor-pointer transition-colors ${
                                snapshot.isDragging ? 'border-electric shadow-[0_0_15px_rgba(100,181,246,0.3)]' : 'border-white/10 hover:border-white/30'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span className="text-electric font-mono text-xs font-bold">{order.orderToken}</span>
                                {order.isPaid ? (
                                  <div className="text-green-400 flex items-center gap-1 text-[10px] uppercase tracking-wider border border-green-500/30 px-2 py-0.5 rounded bg-green-500/10">
                                    <CheckCircle size={10} /> Paid
                                  </div>
                                ) : (
                                  <div className="text-yellow-500 flex items-center gap-1 text-[10px] uppercase tracking-wider border border-yellow-500/30 px-2 py-0.5 rounded bg-yellow-500/10">
                                    Unpaid
                                  </div>
                                )}
                              </div>
                              <h4 className="text-pearl font-sans mb-1">{order.user?.name || order.shippingAddress?.name || 'Guest'}</h4>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                                <span className="text-gray-500 text-xs font-sans">{order.orderItems.length} items</span>
                                <span className="text-pearl font-mono text-sm">Rs. {order.totalPrice.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-midnight border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="mb-6">
                <span className="text-electric font-mono font-bold tracking-wider">{selectedOrder.orderToken}</span>
                <h2 className="text-3xl font-display text-pearl mt-2">Order Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-void border border-white/5 p-4 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Customer</span>
                  <span className="text-pearl font-sans">{selectedOrder.user?.name || selectedOrder.shippingAddress?.name || 'Guest'}</span>
                </div>
                <div className="bg-void border border-white/5 p-4 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Amount</span>
                  <span className="text-pearl font-mono text-lg">Rs. {selectedOrder.totalPrice.toLocaleString()}</span>
                </div>
                <div className="bg-void border border-white/5 p-4 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Payment Method</span>
                  <span className="text-pearl font-sans">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="bg-void border border-white/5 p-4 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Status</span>
                  <span className="text-gold font-sans font-medium">{selectedOrder.status}</span>
                </div>
              </div>

              <div className="border border-white/10 rounded-lg p-6 bg-void mb-8">
                <h3 className="text-pearl font-sans font-medium mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileImage size={18} className="text-electric" /> Payment Verification
                  </div>
                  {selectedOrder.isPaid ? (
                    <span className="text-green-400 text-sm font-sans font-medium flex items-center gap-1">
                      <CheckCircle size={16} /> Verified Paid
                    </span>
                  ) : (
                    <span className="text-yellow-500 text-sm font-sans font-medium">Payment Pending</span>
                  )}
                </h3>
                
                {!selectedOrder.isPaid && (
                  <div>
                    <p className="text-sm text-gray-400 font-sans mb-4">
                      {selectedOrder.paymentMethod === 'COD' 
                        ? 'Cash will be collected upon delivery.' 
                        : `Please verify the ${selectedOrder.paymentMethod} receipt via WhatsApp.`}
                    </p>
                    <button 
                      onClick={() => markAsPaid(selectedOrder._id)}
                      disabled={paying}
                      className="border border-electric text-electric px-4 py-2 rounded text-sm uppercase tracking-wider font-medium hover:bg-electric hover:text-white transition-colors disabled:opacity-50"
                    >
                      {paying ? 'Marking...' : 'Mark as Paid Manually'}
                    </button>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <h3 className="bg-white/5 p-4 text-pearl font-sans text-sm uppercase tracking-wider">Order Items</h3>
                <div className="divide-y divide-white/5 p-4">
                  {selectedOrder.orderItems.map((item, i) => (
                    <div key={i} className="py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-void rounded border border-white/5 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-pearl font-sans text-sm">{item.name}</p>
                          <p className="text-gray-500 font-sans text-xs">Size: {item.size} | Color: {item.color}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs font-sans">Qty: {item.qty}</p>
                        <p className="text-electric font-mono text-sm">Rs. {(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OrderKanban;
