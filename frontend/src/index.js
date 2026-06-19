import React from "react";
import ReactDOM from "react-dom/client";
import Keycloak from "keycloak-js";
import App from "./App";

const keycloak = new Keycloak({
  url: "http://localhost:9090",
  realm: "demo-realm",
  clientId: "demo-client",
});

keycloak
  .init({ pkceMethod: "S256", checkLoginIframe: false })
  .then(() => {
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => keycloak.logout());
    };

    ReactDOM.createRoot(document.getElementById("root")).render(
      <App keycloak={keycloak} />
    );
  })
  .catch((err) => {
    console.error("Falha ao inicializar o Keycloak:", err);
  });
