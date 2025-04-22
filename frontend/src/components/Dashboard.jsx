import {useAuth} from '../AuthContext';
export default function Dashboard(){
    const {user,logout}=useAuth();
    return(
        <div>
            <h2>Welcome {user?.name} ({user?.role})</h2>
            <button onClick={logout}>Logout</button>
        </div>
    );
}