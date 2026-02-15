import { useState, useEffect } from "react";
import UserTable from "./components/UserTable";
import "./App.css";

const API_URL = "http://localhost:8080/api/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  /* ✅ FETCH USERS (READ) */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  /* ✅ ADD / UPDATE USER */
  const saveUser = async () => {
    if (!name || !email) return;

    const userData = { name, email };

    console.log("Saving User:", userData);

    try {
      if (editId !== null) {
        // UPDATE
        await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else {
        // CREATE
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }

      fetchUsers();
      setName("");
      setEmail("");
      setEditId(null);
      setShow(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  /* ✅ DELETE */
  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ✅ EDIT */
  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
    setShow(true);
  };

  return (
    <div className="container">
      <h1 className="title">UserList</h1>

      <div className="topBar">
        <button className="addBtn" onClick={() => setShow(true)}>
          + Add User
        </button>
      </div>

      <UserTable users={users} onDelete={deleteUser} onEdit={editUser} />

      {show && (
        <div className="modal">
          <div className="modalBox">
            <h3>{editId ? "Edit User" : "Add User"}</h3>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="btnRow">
              <button onClick={saveUser}>Save</button>
              <button onClick={() => setShow(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
