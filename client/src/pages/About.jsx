import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">About Me not Us</h1>
      <p className="about-description">
        Website ini dibuat untuk menyelesaikan i-Project, tentu saja bukan
        iPhone yang banyak beredar. Ini merupakan tugas yang bisa dibuat menjadi
        portofolio pribadi, kebetulan untuk membuat Website ini diberikan waktu
        kurang dari 1 minggu, berkisar 3-4 hari saja. Tugas yang diberikan
        merupakan membuat server (backend) yang juga sudah terintegrasi ke sisi
        client (frontend). Website ini menggunakan Node JS dan React.
      </p>

      <h2 className="about-subtitle">My Mission</h2>
      <p className="about-description">
        Tidak ada misi yang perlu diselesaikan cukup dengan menyelesaikan
        i-Project dengan tepat waktu sudah sangat baik sekali kawan!
      </p>

      <h2 className="about-subtitle">My Values</h2>
      <ul className="about-list">
        <li>Quality: Standard sahaja.</li>
        <li>i-Project: Portofolio pertama.</li>
        <li>Chill: Mengerjakan dengan pelan-pelan.</li>
      </ul>

      <h2 className="about-subtitle">Contact Us</h2>
      <p className="about-description">
        Jika ada pertanyaan yang membingungkan silahkan tanya Instruktur kami,
        hehehe, Salam Hacktiv8!
      </p>
      <p className="about-description">
        Email:{" "}
        <a href="mailto:pusyeeng@mail.id" className="about-link">
          pusyeeng@mail.id
        </a>
      </p>
    </div>
  );
}
