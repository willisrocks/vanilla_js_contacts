from .models import Contact, ContactNotFound, DuplicateContact


class ContactRepo:
    """
    Simulate a database store for contacts
    """
    def __init__(self):
        self.contacts = {}
        self.next_id = 1

    def get(self, contact_id):
        contact = self.contacts.get(contact_id, None)
        if contact is None:
            raise ContactNotFound

        return contact

    def list(self):
        return list(self.contacts.values())

    def create(self, contact: Contact):
        if contact.id in self.contacts:
            raise DuplicateContact

        contact.id = self.next_id
        self.contacts[contact.id] = contact
        self.next_id += 1

    def update(self, contact: Contact):
        if contact.id not in self.contacts:
            raise ContactNotFound

        self.contacts[contact.id] = contact

    def delete(self, contact_id: int):
        if contact_id not in self.contacts.keys():
            raise ContactNotFound

        self.contacts.pop(contact_id)
