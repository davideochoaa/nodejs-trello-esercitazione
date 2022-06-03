let dragged = null;

async function getId() {
    const response = await fetch("http://localhost:3333/api/list"
    ,{ headers: { 'Authorization': "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhY2Nlc3MiLCJleHAiOjE2NTQwMzAxNDYsImlkIjoiY2wzc3F0a2Z5MDAwMGd3am5nODhiZHQzNCIsImVtYWlsIjoiZ2lub3Bhb2xpQGdpbWFpbC5naW5vIiwiaWF0IjoxNjUzOTk0MTQ2fQ.JpckR-LuvasOq5-2dBLounqmfx8yDqnBDN2_FEsfsi-zaXYbuKMUfjd47mBOfiaFNnwRFN2E4IgwJvItO5-LGE3p4C8rYHsQkaeqfFetcRh-v4B5iV77ewxrrdmfpOaMHHZiuK-Px1BvZpbASQukqZ7I0n_UUrCCtrc77WGLHZofIqLZrl3KZkgtCTlZvKNqCmQvSE1Wb2bF0aeF8nRJ6-lo77T2taZYB0y04uoAutcHVU2DqAbW90soKyyRIn8Q-bUSAsZmtPMimawCBvXhx3sy58cbGdt4-Dn5vDUEcvOhBD3zmiBtPj190CkIRbVil324Vtqh2kyJiEGQRsWi84hb6puJZPtu9LUGzgc1ZiWryRfBsLan0LTNXvpK2UbjLBs6Vk-PaujeBZLBoFn22Wgw8SkPnkFCWgCpwEPhnh910-KX6D5FE0gw9BHVPPqwrBk_l4nmegAqf4Ojf9J6JD6n5wAnR8jbCqwzIzlpRvJBIzN_SzNKeJq9wK9lJumqTbWJoIKU6RuKiu7e3K3QAzaKPqw7xB1dPuu36TEKeVneu2n0R8aZ2t7n_ugrNCyilX4Cxfifm0SNey2xOiLdzPV5sscBf2J9o1I9unlWGKwmAd_Rl3JOJ8nUb_oUf2WjQBSnW-9z5KGcp_Fo9yAsF3nooesYoKyc4fW0NFY0FmE" } });

    return response.json();
}

const gino = getId();

function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragged = target;
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function handleDragOver(e) {
    this.style.opacity = '1';
    e.preventDefault();
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}


function handleDropEvent(e, id, idBucket) {
    e.preventDefault();
    console.log(e);
    if (e.target.className == "cards-container") {
        dragged.parentNode.removeChild(dragged);
        e.target.appendChild(dragged);
    };
    axios.post(`http://localhost:3333/api/${id}/${idBucket}/move`, { headers: { 'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhY2Nlc3MiLCJleHAiOjE2NTQwMzAxNDYsImlkIjoiY2wzc3F0a2Z5MDAwMGd3am5nODhiZHQzNCIsImVtYWlsIjoiZ2lub3Bhb2xpQGdpbWFpbC5naW5vIiwiaWF0IjoxNjUzOTk0MTQ2fQ.JpckR-LuvasOq5-2dBLounqmfx8yDqnBDN2_FEsfsi-zaXYbuKMUfjd47mBOfiaFNnwRFN2E4IgwJvItO5-LGE3p4C8rYHsQkaeqfFetcRh-v4B5iV77ewxrrdmfpOaMHHZiuK-Px1BvZpbASQukqZ7I0n_UUrCCtrc77WGLHZofIqLZrl3KZkgtCTlZvKNqCmQvSE1Wb2bF0aeF8nRJ6-lo77T2taZYB0y04uoAutcHVU2DqAbW90soKyyRIn8Q-bUSAsZmtPMimawCBvXhx3sy58cbGdt4-Dn5vDUEcvOhBD3zmiBtPj190CkIRbVil324Vtqh2kyJiEGQRsWi84hb6puJZPtu9LUGzgc1ZiWryRfBsLan0LTNXvpK2UbjLBs6Vk-PaujeBZLBoFn22Wgw8SkPnkFCWgCpwEPhnh910-KX6D5FE0gw9BHVPPqwrBk_l4nmegAqf4Ojf9J6JD6n5wAnR8jbCqwzIzlpRvJBIzN_SzNKeJq9wK9lJumqTbWJoIKU6RuKiu7e3K3QAzaKPqw7xB1dPuu36TEKeVneu2n0R8aZ2t7n_ugrNCyilX4Cxfifm0SNey2xOiLdzPV5sscBf2J9o1I9unlWGKwmAd_Rl3JOJ8nUb_oUf2WjQBSnW-9z5KGcp_Fo9yAsF3nooesYoKyc4fW0NFY0FmE' } });
};
