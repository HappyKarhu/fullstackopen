# 0.5: Single Page App

```mermaid
flowchart TD
    A[user opens URL:https://studies.cs.helsinki.fi/exampleapp/spa eli muistiinpanojen Single Page App-versioon] --> B[Selain pyytää SPA-tiedostot palvelimelta];
    B --> C[Palvelin vastaa - HTML ja CSS ja js];
    C --> D[SPA loads and renders];
    D --> E[User clicks button or menu];
    E --> F[SPA updates content, without reloading the page];
    F --> G[User continues interaction. SPA handles routing internally];
```