const funzione = function () {
    location.href = "http://localhost:3333/api/list";
}

//BUTTON ON HEADER
const createBucketButton = document.getElementById("add-bucket-button");
createBucketButton.onclick = createBucket;

// !ATTENZIONE!
// PER POTER VEDERE CORRETTAMENTE GLI ELEMENTI, INSERIRE IL BEAR TOKEN ALL'INTERNO DELLA FETCH

// FUNZIONE getDashboard CHE CREA TUTTE LE DASHBOARD DI UN DETERMINATO UTENTE
async function getDashboard() {
    // MODIFICARE IL BEARER TOKEN, INSERIRE IL VOSTRO BEARER TOKEN DOPO "Bearer <BEARER TOKEN DELL'UTENTE LOGGATO - INSERITELO QUI>"
    const response = await fetch("http://localhost:3333/api/list"
    , {headers: { 'Authorization' : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhY2Nlc3MiLCJleHAiOjE2NTc4NjE2OTEsImlkIjoiY2wzc3F0a2Z5MDAwMGd3am5nODhiZHQzNCIsImVtYWlsIjoiZ2lub3Bhb2xpQGdpbWFpbC5naW5vIiwiaWF0IjoxNjU0MjYxNjkxfQ.mM-WK5Ytk_b5Jtx52gENRYw-Uxq3ETfZdm0DlVbSz5hJtp1Ym9VWCI8fMP0lQeuDDE8XvM55zZdU_ki76o7-b0zNhuAXZnzipj8HXzqn9R84Fzl-19ULHT0TrgtHWt5v61XUtLkXImVC46ILKrS8AoB33D2oVeRq1cd2iipyxcpHdI0tqCQzIrcP_Awt1TqBTxsuM9clg5oXvDaPclqKFckpgQh2LEGkJ2178SWiTPNXS1ei9LuKs6nd4A3ssg9RHL4tMWrwls2rd7HavVbalzlgfRhkP8Eh58IKj9NE8ZsouolDuUkdsxw04t6L4-vLXCcT05m5mHnT9uUl10eby6uDwaKq4DiPISZ8wQZumxQBIviJzxOTE4pRhuB6DqqeBlvQ0pdYc-baGXVrFf8P3ueDjwIFSwOg_YagUpnvWEpqh8O_BnvVBBIlDJCegNkjGY5a6ttZtSMlNWYEbs_DrA3qVp0BFliUJTkU5P0_oTWoWq7fGpKNvossuv37286X2eac0g9KWCBOkfy2k74JfoJIUCqkLk6g7FFdRjJYU3tDW010Gvf32JICLj4TuFJaRnPwlUJ2sCRhaHevD4Ert8mbLs3WUXF1ukBrrs1MSI2lqyVqoU3VPCojOzT6skCH_iCPUaLzcp4hL4Lxn08qtGRuaLcAiFywqcnBKnnsCGo"}});
    const dashboards = await response.json();
    //console.log(dashboards);
    const bucketContainer = document.getElementById("dashboard-container");

    dashboards.forEach(({id,name,contents}) => {
        const newBucket = document.createElement("div");
        const title = document.createTextNode(name);
        newBucket.setAttribute("id",id);
        const titleContainer = document.createElement("h2");
        titleContainer.appendChild(title);
        

        titleContainer.classList.add("title-class");
        const deleteThisBucket = deleteBucket(id); // CREA IL BOTTONE DELETE BUCKET
        newBucket.appendChild(deleteThisBucket);
        newBucket.classList.add("bucket");

        const newCardsContainer = document.createElement("div");
        newCardsContainer.classList.add("cards-container");

        newCardsContainer.setAttribute("draggable", true);
        newCardsContainer.addEventListener("drop", handleDropEvent);
        newCardsContainer.addEventListener("dragstart",handleDragStart);
        newCardsContainer.addEventListener("dragover", handleDragOver);

        const addButton = document.createElement("button");

        // BOTTONE CHE CREA IL CONTENUTO (CARDS)
        addButton.onclick = async () => {
            const title = "titolo della carta"
            //salvo i dati della mia carta appena creata nel Db
            const response = await axios.post(`http://localhost:3333/api/${id}`,{text: title}, {headers: {'Authorization' : 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhY2Nlc3MiLCJleHAiOjE2NTc4NjE2OTEsImlkIjoiY2wzc3F0a2Z5MDAwMGd3am5nODhiZHQzNCIsImVtYWlsIjoiZ2lub3Bhb2xpQGdpbWFpbC5naW5vIiwiaWF0IjoxNjU0MjYxNjkxfQ.mM-WK5Ytk_b5Jtx52gENRYw-Uxq3ETfZdm0DlVbSz5hJtp1Ym9VWCI8fMP0lQeuDDE8XvM55zZdU_ki76o7-b0zNhuAXZnzipj8HXzqn9R84Fzl-19ULHT0TrgtHWt5v61XUtLkXImVC46ILKrS8AoB33D2oVeRq1cd2iipyxcpHdI0tqCQzIrcP_Awt1TqBTxsuM9clg5oXvDaPclqKFckpgQh2LEGkJ2178SWiTPNXS1ei9LuKs6nd4A3ssg9RHL4tMWrwls2rd7HavVbalzlgfRhkP8Eh58IKj9NE8ZsouolDuUkdsxw04t6L4-vLXCcT05m5mHnT9uUl10eby6uDwaKq4DiPISZ8wQZumxQBIviJzxOTE4pRhuB6DqqeBlvQ0pdYc-baGXVrFf8P3ueDjwIFSwOg_YagUpnvWEpqh8O_BnvVBBIlDJCegNkjGY5a6ttZtSMlNWYEbs_DrA3qVp0BFliUJTkU5P0_oTWoWq7fGpKNvossuv37286X2eac0g9KWCBOkfy2k74JfoJIUCqkLk6g7FFdRjJYU3tDW010Gvf32JICLj4TuFJaRnPwlUJ2sCRhaHevD4Ert8mbLs3WUXF1ukBrrs1MSI2lqyVqoU3VPCojOzT6skCH_iCPUaLzcp4hL4Lxn08qtGRuaLcAiFywqcnBKnnsCGo'}});
            //creo un nodo che ospiterà la mia carta

            // BOTTONE CHE ELIMINA IL CONTENUTO
            const deleteButton = deleteCard(id,contents.id);
            newCard.appendChild(deleteButton);
            
            //creo il titolo della carta in un nodo di testo e lo aggiungo alla carta
            /*const cardTitle = document.createTextNode(title);
            newCard.appendChild(cardTitle);
            newCard.ondragstart = handleDragStart;
            newCard.ondragend = handleDragEnd;*/
            //aggiungo lo stile draggable alla card
            /*newCard.setAttribute("draggable",true);
            //aggiungo la carta al container delle carte (che si trova dentro il bucket)
            newCard.classList.add("cards");*/
            
            //newCard.appendChild(cardText);
            newCardsContainer.appendChild(newCard);

            
        };

        const textButton = document.createTextNode("Add Card");
        addButton.classList.add("bottone");
        addButton.appendChild(textButton);
        // forEach che ci riporta tutte le cards con il relativo deleteButton per cancellarle
        contents.forEach((card) => {

            const newCard = createCard(card.text);
            console.log(newCard);

            const deleteButton = deleteCard(id,card.id);
            newCardsContainer.appendChild(newCard);
            newCard.appendChild(deleteButton);


        });

        newBucket.appendChild(titleContainer);
        newBucket.appendChild(newCardsContainer);
        newBucket.appendChild(addButton);
        newBucket.appendChild(deleteThisBucket); // BOTTONE DELETE BUCKET
        bucketContainer.append(newBucket);

        
    });


};

// ***CREATION OF CARD - CONTENT 
// FUNZIONE PER CREARE LE CARDS RICHIAMATE ALL'INTERNO DELL'ALTRA FUNZIONE getDashboard
function createCard(
    cardTitle,
    isDraggable = true, 
    htmlTag = "div", 
    onDragStart = handleDragStart,
    onDragEnd = handleDragEnd,
    ){
        const newCard = document.createElement(htmlTag);
        const cardP = document.createElement("p");
        cardP.classList.add("cards-text");
        const cardText = document.createTextNode(cardTitle);
        newCard.classList.add("cards");
        newCard.appendChild(cardP)
        newCard.ondragstart = onDragStart;
        newCard.ondragend = onDragEnd;
        cardP.appendChild(cardText)
        newCard.setAttribute("draggable", isDraggable);

        return newCard;

};

// *** DELETE CARD - CONTENT - CREATION OF DELETE BUTTON (CARD)
// FUNZIONE CHE CREA IL BOTTONE DELETE CARD ALL'INTERNO DI OGNI CARD
function deleteCard (idBucket,idCard){
    const deleteButton = document.createElement("button");

        deleteButton.onclick = async () => {
            //await dbService.createContent("cl3sr9roa0009uwjnrqopo5h", id,"Default Gino");
            const response = await axios.delete(`http://localhost:3333/api/${idBucket}/${idCard}`,{headers: {'Authorization' : 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhY2Nlc3MiLCJleHAiOjE2NTc4NjE2OTEsImlkIjoiY2wzc3F0a2Z5MDAwMGd3am5nODhiZHQzNCIsImVtYWlsIjoiZ2lub3Bhb2xpQGdpbWFpbC5naW5vIiwiaWF0IjoxNjU0MjYxNjkxfQ.mM-WK5Ytk_b5Jtx52gENRYw-Uxq3ETfZdm0DlVbSz5hJtp1Ym9VWCI8fMP0lQeuDDE8XvM55zZdU_ki76o7-b0zNhuAXZnzipj8HXzqn9R84Fzl-19ULHT0TrgtHWt5v61XUtLkXImVC46ILKrS8AoB33D2oVeRq1cd2iipyxcpHdI0tqCQzIrcP_Awt1TqBTxsuM9clg5oXvDaPclqKFckpgQh2LEGkJ2178SWiTPNXS1ei9LuKs6nd4A3ssg9RHL4tMWrwls2rd7HavVbalzlgfRhkP8Eh58IKj9NE8ZsouolDuUkdsxw04t6L4-vLXCcT05m5mHnT9uUl10eby6uDwaKq4DiPISZ8wQZumxQBIviJzxOTE4pRhuB6DqqeBlvQ0pdYc-baGXVrFf8P3ueDjwIFSwOg_YagUpnvWEpqh8O_BnvVBBIlDJCegNkjGY5a6ttZtSMlNWYEbs_DrA3qVp0BFliUJTkU5P0_oTWoWq7fGpKNvossuv37286X2eac0g9KWCBOkfy2k74JfoJIUCqkLk6g7FFdRjJYU3tDW010Gvf32JICLj4TuFJaRnPwlUJ2sCRhaHevD4Ert8mbLs3WUXF1ukBrrs1MSI2lqyVqoU3VPCojOzT6skCH_iCPUaLzcp4hL4Lxn08qtGRuaLcAiFywqcnBKnnsCGo'}});
            console.log(response);
        };

        deleteButton.classList.add("delete-card");
        const iconDelete = document.createElement("i");
        iconDelete.classList.add('fa-solid','fa-trash-can');
        deleteButton.appendChild(iconDelete);

        return deleteButton;
}

// *** CREATION OF THE BUCKET - DASHBOARD -
// FUNZIONE CHE CREA UNA NUOVA DASHBOARD (BUCKET) - VIENE RICHIAMATA A RIGA 7 
async function createBucket() {
        const bucketTitle = "NUOVO BUCKET";
        await axios.post('http://localhost:3333/api/',{name: `${bucketTitle}`},{headers: {'Authorization' : 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhY2Nlc3MiLCJleHAiOjE2NTc4NjE2OTEsImlkIjoiY2wzc3F0a2Z5MDAwMGd3am5nODhiZHQzNCIsImVtYWlsIjoiZ2lub3Bhb2xpQGdpbWFpbC5naW5vIiwiaWF0IjoxNjU0MjYxNjkxfQ.mM-WK5Ytk_b5Jtx52gENRYw-Uxq3ETfZdm0DlVbSz5hJtp1Ym9VWCI8fMP0lQeuDDE8XvM55zZdU_ki76o7-b0zNhuAXZnzipj8HXzqn9R84Fzl-19ULHT0TrgtHWt5v61XUtLkXImVC46ILKrS8AoB33D2oVeRq1cd2iipyxcpHdI0tqCQzIrcP_Awt1TqBTxsuM9clg5oXvDaPclqKFckpgQh2LEGkJ2178SWiTPNXS1ei9LuKs6nd4A3ssg9RHL4tMWrwls2rd7HavVbalzlgfRhkP8Eh58IKj9NE8ZsouolDuUkdsxw04t6L4-vLXCcT05m5mHnT9uUl10eby6uDwaKq4DiPISZ8wQZumxQBIviJzxOTE4pRhuB6DqqeBlvQ0pdYc-baGXVrFf8P3ueDjwIFSwOg_YagUpnvWEpqh8O_BnvVBBIlDJCegNkjGY5a6ttZtSMlNWYEbs_DrA3qVp0BFliUJTkU5P0_oTWoWq7fGpKNvossuv37286X2eac0g9KWCBOkfy2k74JfoJIUCqkLk6g7FFdRjJYU3tDW010Gvf32JICLj4TuFJaRnPwlUJ2sCRhaHevD4Ert8mbLs3WUXF1ukBrrs1MSI2lqyVqoU3VPCojOzT6skCH_iCPUaLzcp4hL4Lxn08qtGRuaLcAiFywqcnBKnnsCGo'}})
}

// *** DELETE OF THE BUCKET - DASHBOARD -
// FUNZIONE CHE CREA IL BOTTONE PER ELIMINARE LE DASHBOARD (BUCKET) - VIENE RICHIAMATA A RIGA 30
// VIENE POSIZIONATA A RIGA 90

function deleteBucket(idBucket){
    const deleteButton = document.createElement("button");

    deleteButton.onclick = async () => {
        //await dbService.createContent("cl3sr9roa0009uwjnrqopo5h", id,"Default Gino");
        const response = await axios.delete(`http://localhost:3333/api/${idBucket}`,{headers: {'Authorization' : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhY2Nlc3MiLCJleHAiOjE2NTc4NjE2OTEsImlkIjoiY2wzc3F0a2Z5MDAwMGd3am5nODhiZHQzNCIsImVtYWlsIjoiZ2lub3Bhb2xpQGdpbWFpbC5naW5vIiwiaWF0IjoxNjU0MjYxNjkxfQ.mM-WK5Ytk_b5Jtx52gENRYw-Uxq3ETfZdm0DlVbSz5hJtp1Ym9VWCI8fMP0lQeuDDE8XvM55zZdU_ki76o7-b0zNhuAXZnzipj8HXzqn9R84Fzl-19ULHT0TrgtHWt5v61XUtLkXImVC46ILKrS8AoB33D2oVeRq1cd2iipyxcpHdI0tqCQzIrcP_Awt1TqBTxsuM9clg5oXvDaPclqKFckpgQh2LEGkJ2178SWiTPNXS1ei9LuKs6nd4A3ssg9RHL4tMWrwls2rd7HavVbalzlgfRhkP8Eh58IKj9NE8ZsouolDuUkdsxw04t6L4-vLXCcT05m5mHnT9uUl10eby6uDwaKq4DiPISZ8wQZumxQBIviJzxOTE4pRhuB6DqqeBlvQ0pdYc-baGXVrFf8P3ueDjwIFSwOg_YagUpnvWEpqh8O_BnvVBBIlDJCegNkjGY5a6ttZtSMlNWYEbs_DrA3qVp0BFliUJTkU5P0_oTWoWq7fGpKNvossuv37286X2eac0g9KWCBOkfy2k74JfoJIUCqkLk6g7FFdRjJYU3tDW010Gvf32JICLj4TuFJaRnPwlUJ2sCRhaHevD4Ert8mbLs3WUXF1ukBrrs1MSI2lqyVqoU3VPCojOzT6skCH_iCPUaLzcp4hL4Lxn08qtGRuaLcAiFywqcnBKnnsCGo'}});
        console.log(response);
    };

    deleteButton.classList.add("delete-bucket");
    const iconDelete = document.createElement("i");
    iconDelete.classList.add('fa-solid','fa-trash-can');
    const textButton = document.createTextNode("DELETE THIS BUCKET ");
    deleteButton.appendChild(textButton);
    deleteButton.appendChild(iconDelete);

    return deleteButton;
}

window.addEventListener("load", getDashboard);