import {useAuth} from '../AuthContext';
export default function Dashboard(){
    const {user,logout}=useAuth();
    return(
        <div>
            <h2>Welcome Lender {user?.name}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    );
}