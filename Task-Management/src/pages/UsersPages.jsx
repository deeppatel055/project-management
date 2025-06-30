import { useEffect } from 'react';
import UserList from '../components/users/UserList';

const UserPage = ({ isAuthenticated }) => {
  useEffect(() => {
  }, []);

  return <UserList isAuthenticated={isAuthenticated} />;
};

export default UserPage;




