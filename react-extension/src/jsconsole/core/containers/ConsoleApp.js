import { connect } from 'react-redux';
import ConsoleApp from '../components/ConsoleApp';
import { setTheme, setLayout } from '../actions/Settings';

export default connect(({ settings }) => ({
  theme: settings.theme,
  layout: settings.layout,
}), { setTheme, setLayout })(ConsoleApp);