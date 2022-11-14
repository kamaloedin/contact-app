const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require("./utils/contacts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts); // Third-party middleware
app.use(express.static("public")); // Built-in middleware
app.use(express.urlencoded({ extended: true }));

// Konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Halaman Home
app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Kamal",
      email: "kamal@gmail.com",
    },
    {
      nama: "udin",
      email: "udin@gmail.com",
    },
  ];
  res.render("index", { title: "Index", nama: "anon", email: "anon@gmail.com", mahasiswa, layout: "layouts/main-layout" });
});

// Halaman About
app.get("/about", (req, res) => {
  res.render("about", { title: "About", layout: "layouts/main-layout" });
});

// Halaman Contact
app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", { title: "Contact", layout: "layouts/main-layout", contacts, msg: req.flash("msg") });
});

// Halaman Tambah Contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", { title: "Form Add Contact", layout: "layouts/main-layout" });
});

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama contact sudah digunakan!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    check("nohp", "No HP tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", { title: "Form Add Contact", layout: "layouts/main-layout", errors: errors.array() });
      // return res.status(400).json({ errors: errors.array() });
    } else {
      addContact(req.body);
      // Kirimkan flash message
      req.flash("msg", "Data berhasil ditambahkan");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(contact.nama);
    req.flash("msg", "Data berhasil dihapus");
    res.redirect("/contact");
  }
});

// Masuk Halaman Edit Contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", { title: "Form Edit Contact", layout: "layouts/main-layout", contact });
});

// Proses Ubah Contact
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah digunakan!");
      }
      return true;
    }),
    check("email", "Email tidak valid!").isEmail(),
    check("nohp", "No HP tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", { title: "Form Edit Contact", layout: "layouts/main-layout", errors: errors.array(), contact: req.body });
      // return res.status(400).json({ errors: errors.array() });
    } else {
      updateContacts(req.body);
      // Kirimkan flash message
      req.flash("msg", "Data berhasil diubah!");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", { title: "Contact Detail", layout: "layouts/main-layout", contact });
});

app.use((req, res) => {
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app is listening at http://localhost:${port}`);
});
