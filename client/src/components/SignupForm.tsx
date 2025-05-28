import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

interface SignupFormProps {
  // make this prop optional
  handleModalClose?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ handleModalClose }) => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser] = useMutation(ADD_USER);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      Auth.login(data.addUser.token);
      // only call the callback if it was provided
      handleModalClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        name="username"
        placeholder="Your username"
        value={formState.username}
        onChange={onChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Your email"
        value={formState.email}
        onChange={onChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="******"
        value={formState.password}
        onChange={onChange}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
