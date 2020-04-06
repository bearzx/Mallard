import { connect } from 'react-redux';
import ConsoleApp from '../components/ConsoleApp';
import { setTheme, setLayout } from '../actions/Settings';
import { dragStart, dragEnd } from '../actions/ImagePanel';

export default connect(({ settings }) => ({
  theme: settings.theme,
  layout: settings.layout,
}), { setTheme, setLayout, dragStart, dragEnd })(ConsoleApp);