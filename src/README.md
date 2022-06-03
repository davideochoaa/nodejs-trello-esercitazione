# Week 2 

Esercitazione di gruppo

Gli obbiettivi/task da svolgere sono i seguenti:

1.  Effettuare il GET delle Dashboard, alzare il server dell'esercizio precedente(Trello). Modificare la chiamata affinche non serva un utente specifico ma solo e soltanto il contenuto per creare una dashboard(utilizzando id dashboad). Fare questo non appena il componente è visibile sulla schermata

2. Salvare il risultato della chiamata invocata la promise , aspettare risoluzione della promise e salvare il risultato dentro il componente.

3. All'interno del render utilizzare i dati dell'api per renderizzare la giusta UI. 
Utilizzare il risultato della precendete chiamata per associare a ogni dato la sua parte di UI

4. Fare in modo di avere un riferimento o un identificativo della dashboard(bucket). Quando il popoup si chiude l'id del bucket attivo sarà vuoto.

5. Collegare la comparsa del form al click del bottone nel bucket. 

6.  Chiamare l'api che crea il contenuto ( creazione della carta ) al click del submit nel form.

7. refresh dashboard(n card+1). Refresh della dashboard all'inserimento della nuvoa carta. 

Per clonare la repository 

```sh
git clone https://github.com/devis98/WorkGroup2.git
```

Per installare tutte le dipendenze necessarie, aprire la cartella da terminale ed eseguire:

```sh
npm install
```

Per avviare il server 

```sh
npm run start
```

in alternativa eseguire questi due comandi secondo l'ordine mostrato

```sh
npx tsc --watch
npx nodemon dist/index.js
```

Se effettuate modifiche pushare solo ed esclusivamente su branch develop. Spostarsi quindi nel branch "develop" con il seguente comando

```sh
git checkout develop
```

ed effettuare il push. In alternativa

```sh
git push origin develop
```

Utilizzare Insomnia o Postman per il test delle richieste.