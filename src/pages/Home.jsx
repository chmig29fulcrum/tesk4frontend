import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { getAllUsers, modifyUsers } from '../redux/userSlice';

function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const users = useSelector((state) => state.user.data) || [];
  const isBlocked = useSelector((state) => state.user.isBlocked);
  console.log(isBlocked);
  const error = useSelector((state) => state.user.error);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleAction = (actionType) => {
    if (selectedUsers.length === 0) {
      alert('Please select users to perform the action on.');
      return;
    }

    modifyUsers({ userIds: selectedUsers, action: actionType }, dispatch);
    getAllUsers({}, dispatch);
  };

  useEffect(() => {
    getAllUsers({}, dispatch);
  }, [dispatch]);

  return (
    <div className='container my-5'>
      <div>isBlocked = {isBlocked}</div>
      {Object.keys(user.userData).length !== 0 ? (
        <>
          <div>
            <button
              type='submit'
              className='btn btn-primary btn-lg square-button'
              onClick={() => handleAction('block')}
            >
              <span className='btn-icon'>🔒</span> Block
            </button>
            <button
              type='submit'
              className='btn btn-light btn-lg square-button'
              onClick={() => handleAction('unblock')}
            >
              <span className='btn-icon'>🔓</span>
            </button>
            <button
              type='submit'
              className='btn btn-danger btn-lg square-button'
              onClick={() => handleAction('delete')}
            >
              <span className='btn-icon'>🗑️</span>
            </button>
          </div>
          <div className='mt-2'>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th className='text-center'>Select</th>
                  <th className='text-center'>Name</th>
                  <th className='text-center'>Email</th>
                  <th className='text-center'>Last Login</th>
                  <th className='text-center'>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className='text-center'>
                      <input
                        type='checkbox'
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleCheckboxChange(user._id)}
                      />
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.lastLogin}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {' '}
          <h1 className='text-center mb-4'>User Registry</h1>
        </>
      )}
    </div>
  );
}

export default Home;
