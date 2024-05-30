# Labirynt 4

Nowa odsłona gry Labirynt napisana w TypeScript i Three.js

## Projekt

Projekt to próba zaimplementowania gry Labirynt 3 w technologiach webowych oraz dzieleniem się wiedzą jak tworzyć gry na jej przykłdzie. Aby lepiej zrozumieć process powstawania gry zobacz filmy z playlisty: https://www.youtube.com/playlist?list=PLAJ1q8DUVOX9ZTfVaYiauq0xawYobkamB


## Uruchamianie gry

Do uruchomienia gry na swoim komputerze bedziesz potrzebował środowiska uruchomieniowego node.js w wersji 20+ https://nodejs.org/en/download/prebuilt-installer/current oraz aktualnej przeglądarki internetowej.

Po za instalowaniu node.js pobierz kod gry Labirynt 4 i uruchom w konsoli (w folderze gry gdzie jest plik package.json) polecenie

```
npm ci
```

które zainstaluje zależności takie jak biblioteke three.js w folderze `node_modules`

oraz
```
npm run dev
```

które uruchomi serwer na porcie 8080 dzieki czemu bedziemy mogli zobaczyć naszą gre wchodzać na adres http://localhost:8080/ oraz stworzy specjalny plik dla przeglądarki (`public\build\main-bundle.js`) na podstawie wszystkich naszych plików


## Stara wersja


Stara wersja gry dostępna na stronie: https://budzis.pl/Wpisy/Programy/Gry/Labirynt-3/
