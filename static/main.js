const apiUrlBase = '/api';

let state = {
    showForm: false,
    alerts: []
}

function onClearForm() {
    document.querySelector('#add-contact-form').reset();
    onHideForm();
}

function onHideForm() {
    state.showForm = false;
    const form = document.querySelector('#add-contact-form');
    form.style.display = 'none';
    const addFormBtn = document.querySelector('#add-contact');
    addFormBtn.style.display = 'block';
}

function onShowForm() {
    state.showForm = true;
    const form = document.querySelector('#add-contact-form');
    form.style.display = 'block';
    const addFormBtn = document.querySelector('#add-contact');
    addFormBtn.style.display = 'none';
}


function onAddAlert(msg) {
    const alert = `<div style="color: red">${msg}</div>`
    state.alerts.push(alert);
    const alertContent = state.alerts.join('');

    const alerts = document.querySelector('#alerts');
    alerts.innerHTML = alertContent;
}

function onClearAlerts() {
    state.alerts = [];
    const alerts = document.querySelector('#alerts');
    alerts.innerHTML = '';
}


function buildPage(data) {
    const addBtn = '<div><button id="add-contact" onclick="onShowForm()">Add Contact</button></div>';
    const table = buildTable(data);
    return addBtn + table;
}

function buildTable(data) {
    if (!data.length) {
        return 'No contacts found';
    }
    const start = '<table><tr><th style="display: none">ID</th><th>Name</th><th>Email</th><th>Note</th><th></th></tr>';
    const end = '</table>';
    let content = [];
    for (let i = 0; i < data.length; i++) {
        content.push(`<tr><td class="contact-id" style="display: none">${data[i].id}</td><td>${data[i].name}</td><td>${data[i].email}</td><td>${data[i].note}</td><td><button onclick="onContactDelete(${data[i].id})">Delete</button></td></tr>`);
    }
    return start + content.join('') + end;
}

function parseErrorMessages(msgs) {
    return msgs.filter(m => m.hasOwnProperty('loc')).map(m => m.loc);
}

function fetchContacts() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(xhr.responseText);
            const content = document.querySelector('#content');
            content.innerHTML = buildPage(data);
        }
    };
    xhr.open('GET', `${apiUrlBase}/contacts`, true);
    xhr.send();
}

function onContactDelete(id) {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            onClearAlerts();
        } else if (xhr.status >= 400) {
            const response = JSON.parse(xhr.responseText);
            onAddAlert(response);
        }
    };

    xhr.open('DELETE', `${apiUrlBase}/contacts/${id}`);
    xhr.send();

    fetchContacts();
}

function onContactSubmit(evt) {
    evt.preventDefault();

    const addContactForm = document.querySelector('#add-contact-form');
    const formData = new FormData(addContactForm);
    const json = JSON.stringify(Object.fromEntries(formData));

    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            onClearAlerts();
            onClearForm();
        } else if (xhr.status >= 400) {
            const response = JSON.parse(xhr.responseText);
            const responseMessages = parseErrorMessages(JSON.parse(response))
            for (let i = 0; i < responseMessages.length; i++) {
                const msg = `Invalid ${responseMessages[i]}`;
                onAddAlert(msg);
            }
        }
    };

    xhr.open('POST', `${apiUrlBase}/contacts`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(json);

    onHideForm();
    fetchContacts();
}

function onLoad() {
    fetchContacts()

    const addContactForm = document.querySelector('#add-contact-form');
    addContactForm.addEventListener('submit', onContactSubmit);
}

document.addEventListener("DOMContentLoaded", onLoad);