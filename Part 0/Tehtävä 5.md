# 0.5: Single Page App

```mermaid
flowchart TD
    A[Käyttäjä avaa URL:https://studies.cs.helsinki.fi/exampleapp/spa eli muistiinpanojen Single Page App-versioon] --> B[Selain pyytää SPA-tiedostot palvelimelta];
    B --> C[Palvelin vastaa - HTML ja CSS ja js];
    C --> D[SPA lataukset ja renderöinnit];
    D --> E[Käyttäjä napsauttaa painiketta tai valikkoa];
    E --> F[SPA päivittää sisältöä lataamatta sivua uudelleen];
    F --> G[Käyttäjä jatkaa vuorovaikutusta. SPA hoitaa reitityksen sisäisesti];
```