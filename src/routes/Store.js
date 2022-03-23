import jwt_decode from 'jwt-decode';

export const store = value => {
  const token = localStorage.getItem('token');
  const jwtDecode = jwt_decode(token);

  if (value === 'name') {
    return jwtDecode.lastName;
  }

  if (value === 'id') {
    return jwtDecode.userID;
  }

  if (value === 'email') {
    return jwtDecode.email;
  }

  if (value === 'token') {
    return token;
  }

  if (value === 'role') {
    return jwtDecode.role;
  }

  if (value === 'roleName') {
    return jwtDecode.roleName;
  }

  if (value === 'district') {
    return jwtDecode.district;
  }
};

export const clearStore = () => {
  localStorage.clear();
  //console.log("Cache Cleared....")
};
