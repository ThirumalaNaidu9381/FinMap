import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Interests.css";

export default function Interests() {
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);

  const fetchInterests = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/api/interests/${user._id}`);
      setInterests(res.data);
    } catch (err) {
      console.error("Failed to fetch interests", err);
    }
  };

  const removeInterest = async (type, itemId) => {
    if (!user?._id) return;
    try {
      await axios.delete("/api/interests", {
        data: { userId: user._id, type, itemId },
      });
      fetchInterests();
    } catch (err) {
      console.error("Failed to remove interest", err);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [user?._id]); // ✅ Refetch when user changes

  return (
    <section className="interests-container">
      <h2>Your Interests</h2>
      {interests.length === 0 ? (
        <p>No saved interests.</p>
      ) : (
        <ul>
          {interests.map((i) => (
            <li key={i._id}>
              {i.type}: {i.itemId}
              <button
                onClick={() => removeInterest(i.type, i.itemId)}
                style={{ marginLeft: "10px" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
