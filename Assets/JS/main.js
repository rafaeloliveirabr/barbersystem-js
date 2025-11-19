//
function main() {
    const inputName = document.querySelector("#inputName");
    const inputSurname = document.querySelector("#inputSurname");
    const inputPhone = document.querySelector("#inputPhone");
    const inputAddress = document.querySelector("#inputAddress");
    const form = document.querySelector(".formu");
    const resultado = document.querySelector(".resultado");
    const showButton = document.querySelector(".show-btn");
    const confirmBtn = document.querySelector(".confirm-btn");
    const ul = document.querySelector("ul");

    const clients = loadClients();
    let statusEdit = null;

    class Client {
        constructor(name, surname, phone, address) {
            this.name = name;
            this.surname = surname;
            this.phone = phone;
            this.address = address;
        }
    }

    Client.prototype.clearPhone = function () {
        return this.phone.replace(/\D+/g, "");
    };

    Client.prototype.validatePhone = function () {
        const clearPhone = this.clearPhone();
        if (clearPhone === "") return false;
        if (clearPhone.length !== 11) return false;
        return true;
    };

    Client.prototype.showData = function () {
        const show = `${this.name} ${this.surname} | Tel: ${this.clearPhone()} | Endereço: ${this.address}`;
        return show;
    };

    function registerClient(obj) {
        clients.push(obj);
        saveClients(clients);
    }

    function listClients(array) {
        resultado.textContent = "";
        for (let i = 0; i < array.length; i++) {
            const createTag = document.createElement("li");
            // createTag.setAttribute("id", "client-" + i);
            createTag.setAttribute("id", `client-${i}`);
            const btnDel = createDel();
            const spanTagText = document.createElement("span");
            spanTagText.setAttribute("class", "span-text");
            const spanTag = document.createElement("span");
            spanTag.setAttribute("class", "style-li");
            spanTagText.textContent = array[i].showData();
            spanTag.appendChild(spanTagText);
            spanTag.appendChild(btnDel);
            createTag.appendChild(spanTag);
            resultado.appendChild(createTag);
        }
    }

    function saveClients(arrayClients) {
        const clientsJSON = JSON.stringify(arrayClients);
        localStorage.setItem("barberClients", clientsJSON);
        console.log("Clientes salvos no LocalStorage!");
    }

    function loadClients() {
        const load = localStorage.getItem("barberClients");
        if (load === null) return [];
        const loadParse = JSON.parse(load);
        const pushPrototype = [];
        for (let value of loadParse) {
            const client = new Client(value.name, value.surname, value.phone, value.address);
            pushPrototype.push(client);
        }
        return pushPrototype;
    }

    function clientsOnScreen(array) {
        let statusBtn = false;
        showButton.addEventListener("click", function (e) {
            e.preventDefault();
            if (statusBtn === false) {
                listClients(array);
                showButton.textContent = "Ocultar Cadastrados";
                statusBtn = true;
            } else {
                resultado.textContent = "";
                showButton.textContent = "Exibir Cadastrados";
                statusBtn = false;
            }
        });
    }

    function createDel() {
        let createBtnDel = document.createElement("button");
        createBtnDel.textContent = "Apagar";
        createBtnDel.classList.add("btn");
        createBtnDel.classList.add("btn-del");
        return createBtnDel;
    }

    function ulEventListener() {
        ul.addEventListener("click", function (e) {
            const element = e.target;
            if (element.classList.contains("btn-del")) {
                deleteClient(element);
            } else if (element.classList.contains("span-text")) {
                editClient(element);
            }
        });
    }

    function deleteClient(element) {
        console.log("Clicou em apagar!");
        // let liDel = element.parentElement;
        // É melhor usar element.closest('li') neste caso, pois no futuro, caso seja criado outro elemento entre o li e o button, esta função parará de funcionar.
        let liDel = element.closest("li");
        let idDel = liDel.id.replace(/\D+/g, "");
        clients.splice(Number(idDel), 1);
        listClients(clients);
        saveClients(clients);
    }

    function editClient(element) {
        console.log("Clicou na span-text!");
        const liElement = element.closest("li");
        const idLi = liElement.id.replace(/\D+/g, "");
        const clientInitial = clients[idLi];
        inputName.value = clientInitial.name;
        inputSurname.value = clientInitial.surname;
        inputPhone.value = clientInitial.phone;
        inputAddress.value = clientInitial.address;
        statusEdit = idLi;
        confirmBtn.textContent = "Atualizar Dados";
        inputName.focus();
    }

    // -----------------------------------------------------------------------------------

    inputName.focus();
    clientsOnScreen(clients);
    ulEventListener();

    // document.addEventListener("click", function (e) {
    //     let elemento = e.target;
    //     console.log(elemento);
    // });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const clientTemp = new Client(
            inputName.value,
            inputSurname.value,
            inputPhone.value,
            inputAddress.value,
        );

        if (!clientTemp.validatePhone()) {
            alert("Preencha um número de telefone válido!");
            return;
        }

        if (clientTemp.name === "" || clientTemp.surname === "") {
            alert("Os campos de nome e sobrenome são obrigatórios!");
            return;
        }

        if (statusEdit === null) {
            registerClient(clientTemp);
            if (showButton.textContent === "Ocultar Cadastrados") {
                listClients(clients);
            }
            alert(`Cliente ${clientTemp.name} ${clientTemp.surname} registrado!`);
        } else {
            clients[statusEdit] = clientTemp;
            saveClients(clients);
            listClients(clients);
            alert(`Dados do cliente alterados com sucesso!`);
            statusEdit = null;
            confirmBtn.textContent = "Adicionar Cliente";
        }

        inputName.value = "";
        inputSurname.value = "";
        inputPhone.value = "";
        inputAddress.value = "";
        inputName.focus();
    });
}

main();

// const classInp = document.querySelector(".inp");
