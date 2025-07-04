import PropTypes from 'prop-types';
import { getStatusStyle, getStatusLabel } from './utils/projectStatus.js';

const StatusBadge = ({ status, size = 'sm', className = '', withBorder = false }) => {
  const baseStyle = `rounded-full border-none font-medium  ${
    size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
  }`;

  const borderStyle = withBorder ? 'border' : '';

  return (
    <span
      className={`${baseStyle} ${getStatusStyle(status)} ${borderStyle} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string,
  withBorder: PropTypes.bool,
};

export default StatusBadge;

