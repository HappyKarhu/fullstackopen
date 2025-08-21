# 0.1: HTML
luettu

# 0.2: CSS
luettu

# 0.3: HTML:n lomakkeet
luettu

# 0.4: uusi muistiinpano

Valitsin **flowchart**-kaavion sekvenssikaavion sijaan, koska on helppo lukea. Kaaviossa näkyy kaikki olennaiset vaiheet.

```mermaid
flowchart TD
    A[Käyttäjä kirjoittaa tekstin ja painaa Tallenna] --> B[Selaimen POST https://studies.cs.helsinki.fi/exampleapp/new_note]
    %% Palvelin (server) vastaanottaa pyynnön ja tallentaa teksti (new-note)
    B --> C[Palvelin tallentaa muistiinpanon ja palauttaa 302 Redirect]
    %% Selain seuraa uudelleenohjausta
    C --> D[Selaimen GET https://studies.cs.helsinki.fi/exampleapp/notes]
    D --> E[Palvelin lähettää HTML-sivun]
    %% Hakee myös tyylit ja skriptit
    E --> F[Selaimen GET https://studies.cs.helsinki.fi/exampleapp/main.css ja main.js]
    %% JS hakee datan palvelimelta (css,js)
    F --> G[Selaimen JavaScript hakee https://studies.cs.helsinki.fi/exampleapp/data.json]
    G --> H[Palvelin palauttaa JSON (sisältää uuden muistiinpanon)]
    %% Selain renderöi new-notes näytölle
    H --> I[Selaimen JavaScript renderöi muistiinpanolistan näytölle]
```