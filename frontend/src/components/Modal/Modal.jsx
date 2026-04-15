import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export default function Modal({ title, children, onClose }) {
  return createPortal(
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* BACKDROP */}
      <div
        className='backdrop'
        onClick={onClose}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* MODAL */}
      <motion.div
        className='modal'
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className='modalTitle'>{title}</h2>
        {children}
      </motion.div>
    </motion.div>,
    document.getElementById('modal'),
  );
}
