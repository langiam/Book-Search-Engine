import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
const LoginForm = ({ handleModalClose }) => {
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    });
    const [loginUser] = useMutation(LOGIN_USER);
    const onFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginUser({
                variables: { ...formState },
            });
            Auth.login(data.login.token);
            handleModalClose?.();
        }
        catch (err) {
            console.error(err);
        }
    };
    const onChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };
    return (<form onSubmit={onFormSubmit}>
      <input name="email" type="email" placeholder="Your email" value={formState.email} onChange={onChange} required/>
      <input name="password" type="password" placeholder="******" value={formState.password} onChange={onChange} required/>
      <button type="submit">Login</button>
    </form>);
};
export default LoginForm;
