const api = process.env.REACT_APP_API_URL;

const register = ({ body }: { body: any }) =>
  fetch(`${api}/register`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

export default {
  register,
};
