const fs = require("node:fs");

// Membuat folder data kalau belum ada
dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Membuat file contacts.json kalau belum ada
dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// Membaca file contacts.json
const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// Cari kontak berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  return contact;
};

// Menambah data ke dalam contacts.json
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// cek nama yang duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

// hapus salah satu kontak
const deleteContact = (nama) => {
  const contacts = loadContact();
  const index = contacts.findIndex((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  contacts.splice(index, 1);
  saveContacts(contacts);
};

const updateContacts = (contactBaru) => {
  // ini pakai findIndex, tapi mungkin bisa diganti dengan filter
  const contacts = loadContact();
  const index = contacts.findIndex((contact) => contact.nama === contactBaru.oldNama); // cari index kontak yang diubah
  delete contactBaru.oldNama; // hapus data sementara (oldNama)
  contacts[index] = contactBaru; // ganti kontak yang indexnya sesuai dengan kontak baru
  saveContacts(contacts); // simpan kontak terbaru ke dalam contacts.json
};

module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts };
