import view from './view';
import { connect } from 'react-redux';
const mapStateToProps = state => {
  return {
    ...state
  };
};
const Email = connect(mapStateToProps)(view);
export { Email };
