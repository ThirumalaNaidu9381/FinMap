import {useAuth} from '../AuthContext';
export default function Dashboard(){
    const {user,logout}=useAuth();
    return(
        <div>
            <h2>Welcome Borrower {user?.name}</h2>
        </div>
    );
}