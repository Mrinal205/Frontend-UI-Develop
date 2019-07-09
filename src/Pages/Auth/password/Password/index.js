// import PasswordPage from './PasswordPage';
// export default PasswordPage;

import view from './view';
import { connect } from 'react-redux';
const mapStateToProps = ({ user }) => {
  return { user };
};
const Password = connect(mapStateToProps)(view);
export { Password };
