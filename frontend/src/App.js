import React from "react";
import axios from "axios";

function App({ keycloak }) {
  const callPublic = async () => {
    const res = await axios.get("http://localhost:8080/public");
    alert(res.data);
  };

  const callPrivate = async () => {
    try {
      const res = await axios.get("http://localhost:8080/private", {
        headers: keycloak.token
          ? { Authorization: `Bearer ${keycloak.token}` }
          : {},
      });
      alert(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Sem permissão: o backend negou o acesso a este recurso.");
      } else {
        alert("Erro ao chamar o endpoint privado.");
      }
    }
  };

  return (
    <div>
      <h1>React + Keycloak</h1>
      {keycloak.authenticated ? (
        <>
          <p>Bem-vindo, {keycloak.tokenParsed?.name}</p>
          <button onClick={() => keycloak.logout()}>Logout</button>
        </>
      ) : (
        <button onClick={() => keycloak.login()}>Login</button>
      )}
      <hr />
      <button onClick={callPublic}>Chamar endpoint público</button>
      <button onClick={callPrivate}>Chamar endpoint privado</button>
    </div>
  );
}

export default App;
