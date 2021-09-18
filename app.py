import json

from flask import Flask, jsonify, request, render_template
from pydantic import ValidationError

from .models import Contact
from .repo import ContactRepo, ContactNotFound, DuplicateContact

app = Flask(__name__)
repo = ContactRepo()


@app.route("/home")
def home():
    return render_template("index.html")


@app.route("/api/contacts", methods=("GET", "POST"))
def contacts():
    """
    Contacts endpoints for creating and listing contacts.
    """
    if request.method == "GET":
        contacts = repo.list()
        data = [c.dict() for c in contacts]
        return jsonify(data)
    if request.method == "POST":
        req_data = json.loads(request.data)
        try:
            contact = Contact(**req_data)
            repo.create(contact)
            return jsonify([{"msg": "ok"}]), 201
        except ValidationError as e:
            return jsonify(e.json()), 400
        except DuplicateContact:
            return (
                jsonify([{"loc": ["id"]}, {"msg": "existing contact with this id"}]),
                400,
            )


@app.route("/api/contacts/<id>", methods=("GET", "PUT", "DELETE"))
def contact(id):
    """
    Contacts endpoints for getting, updating, or deleting an individual contact.
    Todo: implement PUT method for updating a contact
    """
    contact_id = int(id)

    if request.method == "GET":
        contacts = repo.get(contact_id)
        data = c.dict()
        return jsonify(data)

    if request.method == "DELETE":
        try:
            repo.delete(contact_id)
            return jsonify([{"msg": "ok"}]), 200
        except ContactNotFound:
            return (
                jsonify([{"loc": ["id"]}, {"msg": "no contact with this id"}]),
                404,
            )


if __name__ == "__main__":
    app.run()
