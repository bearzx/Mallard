import { connect } from 'react-redux';
import ImagePanel from '../../../ImagePanel';

export default connect(({ drags }) => ({ isDragStart: drags.isDragStart }))(ImagePanel);